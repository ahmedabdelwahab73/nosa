import express from "express";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import { pinoHttp } from "pino-http";
import { API_PREFIX } from "@nosa/contracts";
import { env, isTest } from "@/config/env";
import { connectDatabase } from "@/config/db";
import { logger } from "@/config/logger";
import { apiRouter } from "@/routes";
import { errorHandler, notFoundHandler } from "@/shared/middlewares/error-handler";
import { requestId } from "@/shared/middlewares/request-id";

export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.set("trust proxy", 1);
  app.use(requestId);
  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGINS, credentials: true }));
  app.use(compression());
  app.use(express.json({ limit: "1mb" }));
  app.use(cookieParser());
  if (!isTest) {
    app.use(
      pinoHttp({
        logger,
        genReqId: (_req, res) => res.getHeader("x-request-id") as string,
        autoLogging: { ignore: (req) => req.url === `${API_PREFIX}/health` },
      }),
    );
  }

  // On Vercel each cold start connects once; warm invocations reuse the connection.
  app.use(async (_req, _res, next) => {
    await connectDatabase();
    next();
  });

  app.use(API_PREFIX, apiRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
