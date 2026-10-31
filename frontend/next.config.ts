import type { NextConfig } from "next";

const apiUrl = new URL(process.env.API_URL ?? "http://localhost:4000");

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Enables forbidden()/unauthorized() for role checks in the auth DAL.
  experimental: { authInterrupts: true },
  // Contracts ship as TypeScript source from the workspace.
  transpilePackages: ["@nosa/contracts"],
  images: {
    remotePatterns: [
      {
        protocol: apiUrl.protocol.replace(":", "") as "http" | "https",
        hostname: apiUrl.hostname,
        port: apiUrl.port,
        pathname: "/uploads/**",
      },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
