import { waitUntil } from "@vercel/functions";
import { CACHE_TAGS, type GovernorateDto } from "@nosa/contracts";
import { z } from "zod";
import { ApiError } from "@/shared/http/api-error";
import { revalidateFrontend } from "@/shared/services/next-revalidate.service";
import { GOVERNORATES } from "./governorates.data";
import { GovernorateModel } from "./governorate.model";
import { flatRateProvider, type ShippingProvider } from "./providers";
import type { shippingRateInputSchema } from "@nosa/contracts";

const provider: ShippingProvider = flatRateProvider;

const toDto = (doc: InstanceType<typeof GovernorateModel>): GovernorateDto => ({
  code: doc.code,
  name: doc.name as GovernorateDto["name"],
  fee: doc.fee,
  estimatedDays: { min: doc.estimatedDays?.min ?? 2, max: doc.estimatedDays?.max ?? 4 },
  isActive: doc.isActive,
});

/** Inserts missing governorates; never overwrites fees the admin already changed. */
export async function seedGovernorates() {
  await GovernorateModel.bulkWrite(
    GOVERNORATES.map((g) => ({ updateOne: { filter: { code: g.code }, update: { $setOnInsert: g }, upsert: true } })),
  );
}

export async function listGovernorates({ includeInactive = false } = {}) {
  const docs = await GovernorateModel.find(includeInactive ? {} : { isActive: true }).sort({ order: 1 });
  return docs.map(toDto);
}

export async function getActiveGovernorate(code: string) {
  const doc = await GovernorateModel.findOne({ code, isActive: true });
  if (!doc) {
    throw new ApiError("VALIDATION_ERROR", "We don't deliver to this governorate", {
      "body.address.governorate": ["UNSUPPORTED_GOVERNORATE"],
    });
  }
  return toDto(doc);
}

export async function quoteShipping(code: string, subtotal: number, freeShipping: boolean) {
  const governorate = await getActiveGovernorate(code);
  return { governorate, ...provider.quote({ governorate, subtotal, freeShipping }) };
}

export async function updateGovernorateRate(code: string, input: z.infer<typeof shippingRateInputSchema>) {
  const doc = await GovernorateModel.findOneAndUpdate({ code }, { $set: input }, { new: true, runValidators: true });
  if (!doc) throw ApiError.notFound("Governorate");
  waitUntil(revalidateFrontend([CACHE_TAGS.shipping]));
  return toDto(doc);
}
