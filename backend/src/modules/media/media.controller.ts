import type { RequestHandler } from "express";
import { CUSTOMER_MEDIA_FOLDERS, DASHBOARD_ROLES, type MediaFolder } from "@nosa/contracts";
import { ApiError } from "@/shared/http/api-error";
import { sendSuccess } from "@/shared/http/api-response";
import { currentUser } from "@/shared/middlewares/auth";
import { signUpload } from "@/shared/services/cloudinary.service";

const isStaffRole = (role: string) => (DASHBOARD_ROLES as readonly string[]).includes(role);

/** Signs a direct browser → Cloudinary upload. Customers may only upload into their folders. */
export const sign: RequestHandler = (req, res) => {
  const user = currentUser(res.locals);
  const folder = req.body.folder as MediaFolder;
  const isStaff = isStaffRole(user.role);

  if (!isStaff && !(CUSTOMER_MEDIA_FOLDERS as readonly string[]).includes(folder)) throw ApiError.forbidden();
  sendSuccess(res, signUpload(folder, { isStaff }));
};
