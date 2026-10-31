import { env } from "@/config/env";
import { logger } from "@/config/logger";
import { connectDatabase, disconnectDatabase } from "@/config/db";
import { createApp } from "@/app";

async function bootstrap() {
  await connectDatabase();

  const server = createApp().listen(env.PORT, () => {
    logger.info(`API ready on http://localhost:${env.PORT}`);
  });

  const shutdown = async () => {
    server.close();
    await disconnectDatabase();
    process.exit(0);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

bootstrap().catch((error) => {
  logger.fatal(error, "Failed to start the API");
  process.exit(1);
});
