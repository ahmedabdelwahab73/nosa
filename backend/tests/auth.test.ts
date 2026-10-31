import { describe, expect, it } from "vitest";
import { api, bearer, createUser } from "./helpers";

describe("auth — phone-first flow", () => {
  it("checks a phone, registers it, then logs in with any phone format", async () => {
    const check1 = await api().post("/api/v1/auth/phone/check").send({ phone: "01012345678" });
    expect(check1.body.data).toEqual({ exists: false });

    const registered = await api()
      .post("/api/v1/auth/register")
      .send({ name: "Mona", phone: "0101 234 5678", password: "strong-pass" });
    expect(registered.status).toBe(201);
    expect(registered.body.data.user).toMatchObject({ name: "Mona", phone: "+201012345678", role: "customer" });
    expect(registered.body.data.tokens.accessToken).toBeTruthy();

    const check2 = await api().post("/api/v1/auth/phone/check").send({ phone: "+201012345678" });
    expect(check2.body.data).toEqual({ exists: true });

    const login = await api().post("/api/v1/auth/login").send({ phone: "201012345678", password: "strong-pass" });
    expect(login.status).toBe(200);

    const me = await api().get("/api/v1/auth/me").set(bearer(login.body.data.tokens.accessToken));
    expect(me.body.data.phone).toBe("+201012345678");
  });

  it("rejects non-Egyptian numbers and short passwords with field errors", async () => {
    const res = await api().post("/api/v1/auth/register").send({ name: "X", phone: "123", password: "short" });
    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
    expect(res.body.error.details).toHaveProperty("body.phone");
    expect(res.body.error.details).toHaveProperty("body.password");
  });

  it("refuses a duplicate phone and a wrong password", async () => {
    const { phone } = await createUser();
    const dup = await api().post("/api/v1/auth/register").send({ name: "Again", phone, password: "another-pass" });
    expect(dup.status).toBe(409);

    const wrong = await api().post("/api/v1/auth/login").send({ phone, password: "not-the-password" });
    expect(wrong.status).toBe(401);
  });

  it("rotates refresh tokens and revokes the session when an old token is reused", async () => {
    const { phone, password } = await createUser();
    const login = await api().post("/api/v1/auth/login").send({ phone, password });
    const first = login.body.data.tokens.refreshToken;

    const rotated = await api().post("/api/v1/auth/refresh").send({ refreshToken: first });
    expect(rotated.status).toBe(200);
    const second = rotated.body.data.tokens.refreshToken;
    expect(second).not.toBe(first);

    const reused = await api().post("/api/v1/auth/refresh").send({ refreshToken: first });
    expect(reused.status).toBe(401);

    // The whole family is gone, so even the newest token stops working.
    const afterRevoke = await api().post("/api/v1/auth/refresh").send({ refreshToken: second });
    expect(afterRevoke.status).toBe(401);
  });

  it("lets an admin create a reset link that sets a new password once", async () => {
    const admin = await createUser("admin");
    const customer = await createUser("customer");

    const link = await api().post(`/api/v1/dashboard/users/${customer.user.id}/reset-link`).set(bearer(admin.token));
    expect(link.status).toBe(201);
    const token = new URL(link.body.data.url).searchParams.get("token");

    const reset = await api().post("/api/v1/auth/reset-password").send({ token, password: "brand-new-pass" });
    expect(reset.status).toBe(200);
    const again = await api().post("/api/v1/auth/reset-password").send({ token, password: "brand-new-pass" });
    expect(again.status).toBe(401);

    const login = await api().post("/api/v1/auth/login").send({ phone: customer.phone, password: "brand-new-pass" });
    expect(login.status).toBe(200);
  });

  it("answers 503 for Google sign-in until GOOGLE_CLIENT_ID is set", async () => {
    const res = await api().post("/api/v1/auth/google").send({ idToken: "some-google-id-token" });
    expect(res.status).toBe(503);
  });
});
