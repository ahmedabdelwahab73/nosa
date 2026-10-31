import { z } from "zod";
import {
  CUSTOM_ORDER_TRANSITIONS,
  type CustomOrderStatus,
  type customOrderInputSchema,
  type customOrderQuoteSchema,
} from "@nosa/contracts";
import { ApiError } from "@/shared/http/api-error";
import { buildMeta, toSkip, type PaginationQuery } from "@/shared/http/pagination";
import { nextSequence } from "@/shared/services/counter.service";
import { CustomOrderModel } from "./custom-orders.model";

type Doc = InstanceType<typeof CustomOrderModel>;

const toDto = (doc: Doc) => {
  const { user: _user, ...json } = doc.toJSON() as Record<string, unknown>;
  return json;
};

function assertTransition(from: CustomOrderStatus, to: CustomOrderStatus) {
  if (!CUSTOM_ORDER_TRANSITIONS[from].includes(to)) {
    throw new ApiError("CONFLICT", `Can't move a request from ${from} to ${to}`, { "body.status": ["INVALID_TRANSITION"] });
  }
}

export async function createCustomOrder(userId: string | undefined, input: z.infer<typeof customOrderInputSchema>) {
  const year = new Date().getFullYear();
  const number = `CUS-${year}-${String(await nextSequence(`custom-${year}`)).padStart(5, "0")}`;
  const doc = await CustomOrderModel.create({ ...input, number, user: userId, history: [{ status: "new" }] });
  return toDto(doc);
}

export async function listMyCustomOrders(userId: string) {
  const docs = await CustomOrderModel.find({ user: userId }).sort({ createdAt: -1 }).limit(100);
  return docs.map(toDto);
}

/** The customer accepts or declines the quote the store sent. */
export async function respondToQuote(userId: string, number: string, accept: boolean) {
  const doc = await CustomOrderModel.findOne({ user: userId, number });
  if (!doc) throw ApiError.notFound("Custom order");
  const next = accept ? "accepted" : "cancelled";
  if (doc.status !== "quoted") throw new ApiError("CONFLICT", "There is no quote to answer yet");
  doc.status = next;
  doc.history.push({ status: next });
  await doc.save();
  return toDto(doc);
}

// ── Dashboard ──────────────────────────────────────────────────────────────

export async function listCustomOrders(status: CustomOrderStatus | undefined, page: PaginationQuery) {
  const filter = status ? { status } : {};
  const [docs, total] = await Promise.all([
    CustomOrderModel.find(filter).sort({ createdAt: -1 }).skip(toSkip(page)).limit(page.limit),
    CustomOrderModel.countDocuments(filter),
  ]);
  return { items: docs.map(toDto), meta: buildMeta(page, total) };
}

export async function getCustomOrder(id: string) {
  const doc = await CustomOrderModel.findById(id);
  if (!doc) throw ApiError.notFound("Custom order");
  return { ...toDto(doc), allowedNextStatuses: CUSTOM_ORDER_TRANSITIONS[doc.status] };
}

export async function sendQuote(id: string, quote: z.infer<typeof customOrderQuoteSchema>) {
  const doc = await CustomOrderModel.findById(id);
  if (!doc) throw ApiError.notFound("Custom order");
  // A quote can be revised while the customer hasn't answered yet.
  if (doc.status !== "quoted") assertTransition(doc.status, "quoted");
  doc.quote = { ...quote, at: new Date() };
  doc.status = "quoted";
  doc.history.push({ status: "quoted", note: quote.message });
  await doc.save();
  return getCustomOrder(id);
}

export async function updateCustomOrderStatus(id: string, status: CustomOrderStatus, note?: string) {
  const doc = await CustomOrderModel.findById(id);
  if (!doc) throw ApiError.notFound("Custom order");
  if (status === "quoted") throw new ApiError("VALIDATION_ERROR", "Use the quote endpoint to send a quote");
  assertTransition(doc.status, status);
  doc.status = status;
  doc.history.push({ status, note });
  await doc.save();
  return getCustomOrder(id);
}

export async function countNewCustomOrders() {
  return CustomOrderModel.countDocuments({ status: "new" });
}
