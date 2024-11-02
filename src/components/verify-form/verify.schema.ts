import { z } from 'zod';

export const VerifySchema = z.object({
  _id: z.string(),
  code: z.string(),
});

export const RetrySchema = z.object({
  email: z.string().email(),
});

export type VerifySchema = z.infer<typeof VerifySchema>;
export type RetrySchema = z.infer<typeof RetrySchema>;
