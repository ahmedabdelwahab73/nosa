import { randomUUID } from "node:crypto";
import { beforeEach, describe, expect, it } from "vitest";
import { CART_ID_HEADER, IDEMPOTENCY_HEADER } from "@nosa/contracts";
import { CategoryModel } from "@/modules/categories/categories.model";
import { ProductModel } from "@/modules/products/products.model";
import { SettingsModel } from "@/modules/settings/settings.model";
import { seedGovernorates } from "@/modules/shipping/shipping.service";
import { api, bearer, createUser } from "./helpers";

const guest = () => ({ [CART_ID_HEADER]: `guest-${randomUUID()}` });

const checkoutBody = (phone = "01012345678") => ({
  contact: { name: "Mona", phone },
  address: { governorate: "cairo", city: "Nasr City", street: "12 Abbas El Akkad" },
  paymentMethod: "cod",
});

let simpleId: string;
let variantId: string;
let customId: string;

beforeEach(async () => {
  await seedGovernorates();
  const category = await CategoryModel.create({ name: { ar: "شنط", en: "Bags" }, slug: "bags" });
  const base = { category: category._id, status: "published", description: { ar: "وصف", en: "Description" } };

  simpleId = (await ProductModel.create({ ...base, name: { ar: "جوانتي", en: "Gloves" }, slug: "gloves", price: 280, stock: 1 })).id;
  variantId = (
    await ProductModel.create({
      ...base,
      name: { ar: "فستان", en: "Dress" },
      slug: "dress",
      price: 1000,
      salePrice: 850,
      options: [{ key: "size", name: { ar: "المقاس", en: "Size" }, values: [{ value: "1-2y", label: { ar: "سنة", en: "1-2y" } }] }],
      variants: [{ sku: "DRESS-1-2y", optionValues: { size: "1-2y" }, stock: 0, isMadeToOrder: true }],
    })
  ).id;
  customId = (
    await ProductModel.create({
      ...base,
      name: { ar: "تطريز", en: "Embroidery" },
      slug: "embroidery",
      price: 600,
      isMadeToOrder: true,
      customization: {
        enabled: true,
        extraPrice: 50,
        fields: [{ key: "names", label: { ar: "الأسامي", en: "Names" }, type: "text", required: true, maxLength: 20 }],
      },
    })
  ).id;
});

describe("cart", () => {
  it("merges identical lines, prices from the server and caps by stock", async () => {
    const cart = guest();
    await api().post("/api/v1/cart/items").set(cart).send({ productId: variantId, sku: "DRESS-1-2y", quantity: 1 });
    const res = await api().post("/api/v1/cart/items").set(cart).send({ productId: variantId, sku: "DRESS-1-2y", quantity: 2 });
    expect(res.body.data.items).toHaveLength(1);
    expect(res.body.data.items[0]).toMatchObject({ quantity: 3, unitPrice: 850, lineTotal: 2550, isMadeToOrder: true });

    const tooMany = await api().post("/api/v1/cart/items").set(cart).send({ productId: simpleId, quantity: 2 });
    expect(tooMany.status).toBe(409);
    expect(tooMany.body.error.details["body.quantity"]).toEqual(["MAX_1"]);
  });

  it("requires a variant and validates personalisation fields", async () => {
    const cart = guest();
    const noSku = await api().post("/api/v1/cart/items").set(cart).send({ productId: variantId });
    expect(noSku.body.error.details).toHaveProperty("body.sku");

    const missing = await api().post("/api/v1/cart/items").set(cart).send({ productId: customId });
    expect(missing.body.error.details).toHaveProperty("body.customization.names");

    const ok = await api().post("/api/v1/cart/items").set(cart).send({ productId: customId, customization: { names: "Mona & Ali" } });
    expect(ok.body.data.items[0].unitPrice).toBe(650);
  });

  it("moves the guest cart into the user's cart after login", async () => {
    const cart = guest();
    await api().post("/api/v1/cart/items").set(cart).send({ productId: simpleId });
    const { token } = await createUser();
    const merged = await api().post("/api/v1/cart/merge").set(cart).set(bearer(token));
    expect(merged.body.data.itemCount).toBe(1);
    expect((await api().get("/api/v1/cart").set(cart)).body.data.itemCount).toBe(0);
  });
});

describe("checkout", () => {
  it("places a cash-on-delivery order, takes the stock and empties the cart", async () => {
    const cart = guest();
    await api().post("/api/v1/cart/items").set(cart).send({ productId: simpleId });
    await api().post("/api/v1/cart/items").set(cart).send({ productId: variantId, sku: "DRESS-1-2y" });

    const res = await api().post("/api/v1/orders").set(cart).send(checkoutBody());
    expect(res.status).toBe(201);
    expect(res.body.data).toMatchObject({
      number: expect.stringMatching(/^NOSA-\d{4}-\d{6}$/),
      status: "pending",
      paymentStatus: "unpaid",
      subtotal: 1130,
      shippingFee: 60,
      total: 1190,
      contact: { phone: "+201012345678" },
    });

    expect((await ProductModel.findById(simpleId))!.stock).toBe(0);
    expect((await ProductModel.findById(simpleId))!.inStock).toBe(false);
    expect((await api().get("/api/v1/cart").set(cart)).body.data.itemCount).toBe(0);

    const tracked = await api().post("/api/v1/orders/track").send({ number: res.body.data.number, phone: "01012345678" });
    expect(tracked.status).toBe(200);
  });

  it("returns the same order for a retried request with the same idempotency key", async () => {
    const cart = guest();
    await api().post("/api/v1/cart/items").set(cart).send({ productId: variantId, sku: "DRESS-1-2y" });
    const key = { [IDEMPOTENCY_HEADER]: `checkout-${randomUUID()}` };

    const first = await api().post("/api/v1/orders").set(cart).set(key).send(checkoutBody());
    const second = await api().post("/api/v1/orders").set(cart).set(key).send(checkoutBody());
    expect(second.body.data.id).toBe(first.body.data.id);
  });

  it("never sells the last piece twice when two customers check out at once", async () => {
    const [a, b] = [guest(), guest()];
    await api().post("/api/v1/cart/items").set(a).send({ productId: simpleId });
    await api().post("/api/v1/cart/items").set(b).send({ productId: simpleId });

    const results = await Promise.all([
      api().post("/api/v1/orders").set(a).send(checkoutBody("01011111111")),
      api().post("/api/v1/orders").set(b).send(checkoutBody("01022222222")),
    ]);
    expect(results.map((r) => r.status).sort()).toEqual([201, 409]);
    expect((await ProductModel.findById(simpleId))!.stock).toBe(0);
  });

  it("applies a coupon once and blocks it when its uses run out", async () => {
    const admin = await createUser("admin");
    await api()
      .post("/api/v1/dashboard/coupons")
      .set(bearer(admin.token))
      .send({ code: "nosa10", type: "percent", value: 10, maxUses: 1 });

    const first = guest();
    await api().post("/api/v1/cart/items").set(first).send({ productId: variantId, sku: "DRESS-1-2y" });
    const applied = await api().post("/api/v1/cart/coupon").set(first).send({ code: "NOSA10" });
    expect(applied.body.data.discount).toBe(85);
    const order = await api().post("/api/v1/orders").set(first).send(checkoutBody());
    expect(order.body.data).toMatchObject({ discount: 85, total: 825, couponCode: "NOSA10" });

    const second = guest();
    await api().post("/api/v1/cart/items").set(second).send({ productId: variantId, sku: "DRESS-1-2y" });
    const denied = await api().post("/api/v1/cart/coupon").set(second).send({ code: "NOSA10" });
    expect(denied.body.error.details["body.code"]).toEqual(["COUPON_USED_UP"]);
  });

  it("refuses payment methods that aren't live and guests when guest checkout is off", async () => {
    const cart = guest();
    await api().post("/api/v1/cart/items").set(cart).send({ productId: variantId, sku: "DRESS-1-2y" });

    const card = await api().post("/api/v1/orders").set(cart).send({ ...checkoutBody(), paymentMethod: "card" });
    expect(card.body.error.details["body.paymentMethod"]).toEqual(["PAYMENT_METHOD_UNAVAILABLE"]);

    await api().get("/api/v1/settings"); // creates the settings document
    await SettingsModel.updateOne({ key: "store" }, { "checkout.allowGuest": false });
    expect((await api().post("/api/v1/orders").set(cart).send(checkoutBody())).status).toBe(401);
  });
});

describe("order status", () => {
  it("follows the allowed path and puts stock back on cancel", async () => {
    const cart = guest();
    await api().post("/api/v1/cart/items").set(cart).send({ productId: simpleId });
    const order = (await api().post("/api/v1/orders").set(cart).send(checkoutBody())).body.data;
    const staff = await createUser("staff");
    const url = `/api/v1/dashboard/orders/${order.id}/status`;

    const skip = await api().patch(url).set(bearer(staff.token)).send({ status: "shipped" });
    expect(skip.status).toBe(409);

    const cancelled = await api().patch(url).set(bearer(staff.token)).send({ status: "cancelled", note: "Customer asked" });
    expect(cancelled.body.data.status).toBe("cancelled");
    expect(cancelled.body.data.allowedNextStatuses).toEqual([]);
    expect((await ProductModel.findById(simpleId))!.stock).toBe(1);
  });

  it("marks cash orders as paid when delivered", async () => {
    const cart = guest();
    await api().post("/api/v1/cart/items").set(cart).send({ productId: variantId, sku: "DRESS-1-2y" });
    const order = (await api().post("/api/v1/orders").set(cart).send(checkoutBody())).body.data;
    const staff = await createUser("staff");
    const url = `/api/v1/dashboard/orders/${order.id}/status`;

    for (const status of ["confirmed", "ready", "shipped", "delivered"]) {
      expect((await api().patch(url).set(bearer(staff.token)).send({ status })).status).toBe(200);
    }
    const detail = await api().get(`/api/v1/dashboard/orders/${order.id}`).set(bearer(staff.token));
    expect(detail.body.data.paymentStatus).toBe("paid");
    expect(detail.body.data.statusHistory).toHaveLength(5);
  });
});
