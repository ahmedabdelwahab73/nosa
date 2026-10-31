import { describe, expect, it } from "vitest";
import { api, bearer, createUser } from "./helpers";

describe("staff management", () => {
  it("lets an admin create a member who must change the temporary password", async () => {
    const admin = await createUser("admin");
    const created = await api()
      .post("/api/v1/dashboard/users/staff")
      .set(bearer(admin.token))
      .send({ name: "Sara", phone: "01011112222", password: "temp-pass-1", role: "editor" });
    expect(created.status).toBe(201);
    expect(created.body.data).toMatchObject({ role: "editor", mustChangePassword: true });

    const login = await api().post("/api/v1/auth/login").send({ phone: "01011112222", password: "temp-pass-1" });
    expect(login.body.data.user.mustChangePassword).toBe(true);

    const token = login.body.data.tokens.accessToken;
    const wrong = await api().post("/api/v1/auth/change-password").set(bearer(token)).send({ currentPassword: "nope-nope-1", newPassword: "brand-new-pass" });
    expect(wrong.status).toBe(422);
    expect(wrong.body.error.details).toHaveProperty("body.currentPassword");

    const changed = await api().post("/api/v1/auth/change-password").set(bearer(token)).send({ currentPassword: "temp-pass-1", newPassword: "brand-new-pass" });
    expect(changed.status).toBe(200);
    expect(changed.body.data.user.mustChangePassword).toBeUndefined();

    // The old session is gone, the new password works.
    const oldRefresh = await api().post("/api/v1/auth/refresh").send({ refreshToken: login.body.data.tokens.refreshToken });
    expect(oldRefresh.status).toBe(401);
    expect((await api().post("/api/v1/auth/login").send({ phone: "01011112222", password: "brand-new-pass" })).status).toBe(200);
  });

  it("keeps customers and staff out, and only owners assign the owner role", async () => {
    const customer = await createUser("customer");
    const staff = await createUser("staff");
    const admin = await createUser("admin");
    expect((await api().get("/api/v1/dashboard/users/staff").set(bearer(customer.token))).status).toBe(403);
    expect((await api().get("/api/v1/dashboard/users/staff").set(bearer(staff.token))).status).toBe(403);

    const body = { name: "Big Boss", phone: "01033334444", password: "temp-pass-1", role: "owner" };
    expect((await api().post("/api/v1/dashboard/users/staff").set(bearer(admin.token)).send(body)).status).toBe(403);
  });

  it("sets a temporary password, disables a member and ends their sessions", async () => {
    const owner = await createUser("owner");
    const member = await createUser("staff");
    const login = await api().post("/api/v1/auth/login").send({ phone: member.phone, password: member.password });

    const reset = await api().patch(`/api/v1/dashboard/users/staff/${member.user.id}`).set(bearer(owner.token)).send({ password: "another-temp-1" });
    expect(reset.status).toBe(200);
    expect((await api().post("/api/v1/auth/refresh").send({ refreshToken: login.body.data.tokens.refreshToken })).status).toBe(401);
    const again = await api().post("/api/v1/auth/login").send({ phone: member.phone, password: "another-temp-1" });
    expect(again.body.data.user.mustChangePassword).toBe(true);

    const off = await api().patch(`/api/v1/dashboard/users/staff/${member.user.id}`).set(bearer(owner.token)).send({ isActive: false });
    expect(off.status).toBe(200);
    expect((await api().post("/api/v1/auth/login").send({ phone: member.phone, password: "another-temp-1" })).status).toBe(403);

    const self = await api().patch(`/api/v1/dashboard/users/staff/${owner.user.id}`).set(bearer(owner.token)).send({ isActive: false });
    expect(self.status).toBe(403);
  });
});
