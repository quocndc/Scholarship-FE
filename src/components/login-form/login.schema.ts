import { z } from 'zod';

export const LoginSchema = z.object({
  username: z.string().min(3).max(255),
  password: z.string().min(6).max(255),
  // .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{3,}$/),
  save: z.boolean().default(false),
});
export type LoginSchema = z.infer<typeof LoginSchema>;
