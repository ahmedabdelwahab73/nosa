import request from "supertest";
import type { UserRole } from "@nosa/contracts";
import { createApp } from "@/app";
import { UserModel } from "@/modules/users/users.model";
import { hashPassword } from "@/shared/services/password.service";
import { signAccessToken } from "@/shared/services/token.service";

export const app = createApp();
export const api = () => request(app);

let phoneCounter = 0;

/** Creates a user directly in the DB and returns a valid access token for it. */
export async function createUser(role: UserRole = "customer", password = "secret-pass-1") {
  const phone = `+2010${String(phoneCounter++).padStart(8, "0")}`;
  const user = await UserModel.create({
    name: `${role} user`,
    phone,
    role,
    providers: ["phone"],
    passwordHash: await hashPassword(password),
  });
  return { user, phone, password, token: signAccessToken({ sub: user.id, role }) };
}

export const bearer = (token: string) => ({ authorization: `Bearer ${token}` });
