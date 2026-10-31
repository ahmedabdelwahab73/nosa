import type { CreateStaffInput, StaffMemberDto, UpdateStaffInput } from "@nosa/contracts";

/** What the form holds while typing: everything is a string or boolean. */
export type StaffDraft = {
  name: string;
  phone: string;
  role: StaffMemberDto["role"];
  password: string;
  isActive: boolean;
};

export const emptyStaffDraft = (): StaffDraft => ({ name: "", phone: "", role: "staff", password: "", isActive: true });

export const draftFromMember = (member: StaffMemberDto): StaffDraft => ({
  name: member.name,
  phone: member.phone ?? "",
  role: member.role,
  password: "",
  isActive: member.isActive,
});

export const toCreateInput = (draft: StaffDraft): CreateStaffInput => ({
  name: draft.name,
  phone: draft.phone,
  password: draft.password,
  role: draft.role,
});

/** The password is only sent when typed, so editing never resets it by accident. */
export const toUpdateInput = (draft: StaffDraft): UpdateStaffInput => ({
  role: draft.role,
  isActive: draft.isActive,
  ...(draft.password && { password: draft.password }),
});
