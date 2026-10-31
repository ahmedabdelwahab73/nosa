import { z } from "zod";
import { paginationQuerySchema } from "@/shared/http/pagination";

export { createStaffSchema, updateStaffSchema } from "@nosa/contracts";
export type { CreateStaffInput, UpdateStaffInput } from "@nosa/contracts";

export const customersQuerySchema = paginationQuerySchema.extend({
  q: z.string().trim().max(100).optional(),
});

export type CustomersQuery = z.infer<typeof customersQuerySchema>;
