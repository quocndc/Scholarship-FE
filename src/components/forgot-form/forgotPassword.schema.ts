import { z } from 'zod';

export const ForgotPasswordSchema = z
  .object({
    code: z.string(),
    password: z.string().regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
      message: 'Mật khẩu cần ít nhất 8 ký tự, bao gồm chữ và số',
    }),
    confirmPassword: z.string().min(3).max(255),
    email: z.string().email(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu không khớp',
  });

export type ForgotPasswordSchema = z.infer<typeof ForgotPasswordSchema>;
