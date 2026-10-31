import { createHash } from "node:crypto";
import type { MediaFolder, MediaSignature } from "@nosa/contracts";
import { env } from "@/config/env";
import { ApiError } from "@/shared/http/api-error";
import { logger } from "@/config/logger";

const ROOT_FOLDER = "nosa";
const ALLOWED_FORMATS = "jpg,jpeg,png,webp,avif,heic";
const MB = 1024 * 1024;

function credentials() {
  const { CLOUDINARY_CLOUD_NAME: cloudName, CLOUDINARY_API_KEY: apiKey, CLOUDINARY_API_SECRET: apiSecret } = env;
  if (!cloudName || !apiKey || !apiSecret) throw ApiError.notConfigured("Cloudinary");
  return { cloudName, apiKey, apiSecret };
}

/** Cloudinary signature: SHA-1 of the alphabetically sorted params + the API secret. */
function sign(params: Record<string, string | number>, apiSecret: string) {
  const payload = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  return createHash("sha1").update(payload + apiSecret).digest("hex");
}

/**
 * Signs a direct browser → Cloudinary upload. The image bytes never reach our server.
 * Customers get a smaller size limit than staff.
 */
export function signUpload(folder: MediaFolder, { isStaff }: { isStaff: boolean }): MediaSignature {
  const { cloudName, apiKey, apiSecret } = credentials();
  const timestamp = Math.round(Date.now() / 1000);
  const fullFolder = `${ROOT_FOLDER}/${folder}`;
  const params = { folder: fullFolder, timestamp, allowed_formats: ALLOWED_FORMATS };

  return {
    cloudName,
    apiKey,
    timestamp,
    folder: fullFolder,
    allowedFormats: ALLOWED_FORMATS,
    maxFileSize: (isStaff ? 10 : 5) * MB,
    signature: sign(params, apiSecret),
    uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
  };
}

/** Lets Cloudinary fetch a remote file itself (e.g. Instagram media) — bytes skip our server. */
export async function uploadFromUrl(url: string, folder: MediaFolder) {
  const { cloudName, apiKey, apiSecret } = credentials();
  const timestamp = Math.round(Date.now() / 1000);
  const params = { folder: `${ROOT_FOLDER}/${folder}`, timestamp };

  const body = new URLSearchParams({ file: url, api_key: apiKey, signature: sign(params, apiSecret), ...stringify(params) });
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
    method: "POST",
    body,
    signal: AbortSignal.timeout(30_000),
  });
  if (!res.ok) throw new ApiError("INTERNAL_ERROR", `Cloudinary upload failed (${res.status})`);
  return (await res.json()) as { public_id: string; width: number; height: number; format: string; resource_type: string };
}

/** Deletes an asset; failures are logged, never thrown (it is cleanup work). */
export async function destroyAsset(publicId: string) {
  try {
    const { cloudName, apiKey, apiSecret } = credentials();
    const timestamp = Math.round(Date.now() / 1000);
    const params = { public_id: publicId, timestamp };
    const body = new URLSearchParams({ api_key: apiKey, signature: sign(params, apiSecret), ...stringify(params) });
    await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
      method: "POST",
      body,
      signal: AbortSignal.timeout(10_000),
    });
  } catch (error) {
    logger.warn({ publicId, error }, "Cloudinary delete failed");
  }
}

const stringify = (params: Record<string, string | number>) =>
  Object.fromEntries(Object.entries(params).map(([key, value]) => [key, String(value)]));
