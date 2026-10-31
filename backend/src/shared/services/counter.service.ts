import { Schema, model } from "mongoose";

const counterSchema = new Schema({ _id: { type: String, required: true }, seq: { type: Number, default: 0 } });
const CounterModel = model("Counter", counterSchema);

/** Atomic sequence per key (e.g. "order-2026") — safe with parallel requests. */
export async function nextSequence(key: string) {
  const counter = await CounterModel.findOneAndUpdate({ _id: key }, { $inc: { seq: 1 } }, { upsert: true, new: true });
  return counter.seq;
}
