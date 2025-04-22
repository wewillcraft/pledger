import { z } from "zod";
import { RecordId } from "@surrealdb/surrealdb";

export const PublicUserSchema = z.object({
  id: z.instanceof(RecordId).optional(),
  email: z.string().email(),
  password_hash: z.string().optional(),
  email_verification_token: z.string().optional(),
  email_verified: z.boolean().optional(),
  name: z.string().optional(),
  date_created: z.date().optional(),
});

export type PublicUser = z.infer<typeof PublicUserSchema>;
