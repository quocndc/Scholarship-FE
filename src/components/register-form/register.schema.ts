import { z } from 'zod';

export const RegisterSchema = z
  .object({
    name: z.string().min(3).max(255),
    email: z.string().regex(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g, { message: 'Email không hợp lệ' }),
    password: z.string().regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
      message: 'Mật khẩu cần ít nhất 8 ký tự, bao gồm chữ và số',
    }),
    repassword: z.string().min(3).max(255),
    age: z.coerce.number().min(0).max(100),
    phone: z.string().regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g, { message: 'Số điện thoại cần bắt đầu bằng 84 hoặc 0, và có 10 số' }),
    address: z.string().min(10).max(255),
    gender: z.enum(['Male', 'Female']).default('Male'),
  })
  .refine((data) => data.password === data.repassword, {
    message: 'Mật khẩu không khớp',
    path: ['repassword'],
  });

export type RegisterSchema = z.infer<typeof RegisterSchema>;
