import type { RequestHandler } from "express";
import mongoose from "mongoose";
import { sendSuccess } from "@/shared/http/api-response";

export const getHealth: RequestHandler = (_req, res) => {
  sendSuccess(res, {
    status: "ok",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    uptime: Math.round(process.uptime()),
  });
};
