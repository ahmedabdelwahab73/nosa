import { describe, expect, it } from "vitest";
import { api, bearer, createUser } from "./helpers";

describe("settings — shape promised by the contract", () => {
  it("always returns contact and socials, and never leaks ids inside localized text", async () => {
    const { token } = await createUser("owner");
    const res = await api().get("/api/v1/dashboard/settings").set(bearer(token));

    expect(res.status).toBe(200);
    // Empty nested objects must still exist so the dashboard form can read them.
    expect(res.body.data.contact).toEqual({});
    expect(res.body.data.socials).toEqual({});
    // Sub-documents without an _id must not get an `"id": "undefined"` property.
    expect(res.body.data.storeName).toEqual({ ar: "نوسة للمشغولات اليدوية", en: "Nosa Handmade Crafts" });
    expect(res.body.data.announcement.text).toEqual({});
  });

  it("lets only admins and owners change settings", async () => {
    const editor = await createUser("editor");
    const denied = await api().put("/api/v1/dashboard/settings").set(bearer(editor.token)).send({});
    expect(denied.status).toBe(403);
  });
});
