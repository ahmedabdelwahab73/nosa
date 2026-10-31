import mongoose from "mongoose";
import { env } from "./env";
import { logger } from "./logger";
import { baseSchemaPlugin } from "@/shared/db/base-schema.plugin";

mongoose.plugin(baseSchemaPlugin);
mongoose.set("strictQuery", true);

/**
 * One connection per process, reused across Vercel Function invocations
 * (the module stays loaded between warm requests).
 */
let connecting: Promise<typeof mongoose> | null = null;

export function connectDatabase(uri = env.MONGODB_URI) {
  if (mongoose.connection.readyState === 1) return Promise.resolve(mongoose);
  connecting ??= mongoose
    .connect(uri, { maxPoolSize: 5, serverSelectionTimeoutMS: 8000 })
    .then((connection) => {
      logger.info("MongoDB connected");
      return connection;
    })
    .catch((error) => {
      connecting = null;
      throw error;
    });
  return connecting;
}

export async function disconnectDatabase() {
  connecting = null;
  await mongoose.disconnect();
}
