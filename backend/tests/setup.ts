import mongoose from "mongoose";
import { afterAll, beforeAll, beforeEach, vi } from "vitest";
import { connectDatabase, disconnectDatabase } from "@/config/db";

// Revalidation calls the Next.js app; tests never need it.
vi.mock("@/shared/services/next-revalidate.service", () => ({ revalidateFrontend: vi.fn(async () => {}) }));

beforeAll(async () => {
  await connectDatabase();
  await Promise.all(Object.values(mongoose.models).map((model) => model.syncIndexes()));
});

beforeEach(async () => {
  const collections = await mongoose.connection.db!.collections();
  await Promise.all(collections.map((collection) => collection.deleteMany({})));
});

afterAll(async () => {
  await disconnectDatabase();
});
