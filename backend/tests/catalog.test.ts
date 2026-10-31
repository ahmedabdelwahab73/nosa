import { beforeEach, describe, expect, it } from "vitest";
import { api, bearer, createUser } from "./helpers";

const category = { name: { ar: "شنط", en: "Bags" } };

const product = (categoryId: string, overrides: Record<string, unknown> = {}) => ({
  name: { ar: "شنطة روز", en: "Pink bag" },
  description: { ar: "وصف", en: "Description" },
  category: categoryId,
  price: 900,
  status: "published",
  options: [
    {
      key: "color",
      name: { ar: "اللون", en: "Color" },
      values: [{ value: "pink", label: { ar: "روز", en: "Pink" }, hex: "#c99a9e" }],
    },
  ],
  variants: [{ sku: "BAG-PINK", optionValues: { color: "pink" }, stock: 2 }],
  ...overrides,
});

describe("catalog — permissions", () => {
  it("blocks customers and anonymous users from the dashboard", async () => {
    const customer = await createUser("customer");
    expect((await api().get("/api/v1/dashboard/products")).status).toBe(401);
    expect((await api().get("/api/v1/dashboard/products").set(bearer(customer.token))).status).toBe(403);
  });

  it("lets staff read but not write products", async () => {
    const staff = await createUser("staff");
    expect((await api().get("/api/v1/dashboard/products").set(bearer(staff.token))).status).toBe(200);
    const write = await api().post("/api/v1/dashboard/categories").set(bearer(staff.token)).send(category);
    expect(write.status).toBe(403);
  });
});

describe("catalog — products", () => {
  let editorToken: string;
  let categoryId: string;

  beforeEach(async () => {
    editorToken = (await createUser("editor")).token;
    const res = await api().post("/api/v1/dashboard/categories").set(bearer(editorToken)).send(category);
    expect(res.status).toBe(201);
    expect(res.body.data.slug).toBe("bags");
    categoryId = res.body.data.id;
  });

  it("creates a product with a unique slug and shows it on the storefront", async () => {
    const first = await api().post("/api/v1/dashboard/products").set(bearer(editorToken)).send(product(categoryId));
    expect(first.status).toBe(201);
    expect(first.body.data.slug).toBe("pink-bag");

    const second = await api()
      .post("/api/v1/dashboard/products")
      .set(bearer(editorToken))
      .send(product(categoryId, { variants: [{ sku: "BAG-PINK-2", optionValues: { color: "pink" }, stock: 0 }] }));
    expect(second.body.data.slug).toBe("pink-bag-2");
    expect(second.body.data.inStock).toBe(false);

    const list = await api().get("/api/v1/products?category=bags&sort=price_asc");
    expect(list.status).toBe(200);
    expect(list.body.meta.total).toBe(2);
    expect(list.body.data[0]).toMatchObject({ slug: expect.any(String), category: { slug: "bags" } });

    const detail = await api().get("/api/v1/products/pink-bag");
    expect(detail.body.data.name.en).toBe("Pink bag");
  });

  it("filters by color, stock and price, and hides drafts", async () => {
    await api().post("/api/v1/dashboard/products").set(bearer(editorToken)).send(product(categoryId));
    await api()
      .post("/api/v1/dashboard/products")
      .set(bearer(editorToken))
      .send(product(categoryId, { name: { ar: "مسودة", en: "Draft bag" }, status: "draft", variants: [{ sku: "D-1", optionValues: { color: "pink" }, stock: 1 }] }));

    const pink = await api().get("/api/v1/products?color=pink&inStock=true&minPrice=500&maxPrice=1000");
    expect(pink.body.meta.total).toBe(1);

    const none = await api().get("/api/v1/products?color=blue");
    expect(none.body.meta.total).toBe(0);
  });

  it("rejects a sale price above the price and variants with unknown options", async () => {
    const res = await api()
      .post("/api/v1/dashboard/products")
      .set(bearer(editorToken))
      .send(product(categoryId, { salePrice: 1200, variants: [{ sku: "X", optionValues: { color: "blue" } }] }));
    expect(res.status).toBe(422);
    expect(res.body.error.details).toHaveProperty("body.salePrice");
    expect(res.body.error.details).toHaveProperty("body.variants");
  });

  it("won't delete a category that still has products", async () => {
    await api().post("/api/v1/dashboard/products").set(bearer(editorToken)).send(product(categoryId));
    const admin = await createUser("admin");
    const res = await api().delete(`/api/v1/dashboard/categories/${categoryId}`).set(bearer(admin.token));
    expect(res.status).toBe(409);
  });

  it("returns 404 with the standard envelope for unknown products", async () => {
    const res = await api().get("/api/v1/products/does-not-exist");
    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({ success: false, error: { code: "NOT_FOUND" } });
    expect(res.headers["x-request-id"]).toBeTruthy();
  });
});
