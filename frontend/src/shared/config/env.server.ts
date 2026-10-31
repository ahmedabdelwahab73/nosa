import "server-only";
import { z } from "zod";

const serverEnvSchema = z.object({
  API_URL: z.url().default("http://localhost:4000"),
  REVALIDATE_SECRET: z.string().min(1),
});

export const serverEnv = serverEnvSchema.parse(process.env);
