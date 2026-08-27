import { z } from "zod";

export const memberSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  membershipType: z.string(),
  emailAddress: z.string(),
  phoneNumber: z.string(),
  churchBranch: z.string(),
  conference: z.string(),
  isActive: z.boolean(),
  membershipId: z.string(),
  isDemo: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
//   accounts: z.array(z.unknown()),
  gpsAddress: z.string(),
});

export const authResponseSchema = z.object({
  member: memberSchema,
  accessToken: z.string(),
  refreshToken: z.string(),
  tokenType: z.string(),
  expiresIn: z.number(),
});

export type Member = z.infer<typeof memberSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;