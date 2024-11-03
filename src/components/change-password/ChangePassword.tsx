import { useChangePassword } from '@components/change-password/useChangePassword';
import Button from '@components/tailus-ui/Button';
import { Form, InputForm } from '@components/tailus-ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
      message: 'Mật khẩu cần ít nhất 8 ký tự, bao gồm chữ và số',
    }),
    newPassword: z.string().regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
      message: 'Mật khẩu cần ít nhất 8 ký tự, bao gồm chữ và số',
    }),
    rePassword: z.string().min(3).max(255),
  })
  .refine((data) => data.newPassword === data.rePassword, {
    message: 'Mật khẩu không khớp',
    path: ['repassword'],
  });

export type ChangePasswordSchema = z.infer<typeof ChangePasswordSchema>;

function ChangePassword() {
  const form = useForm<ChangePasswordSchema>({
    resolver: zodResolver(ChangePasswordSchema),
  });
  const { mutateAsync: changePassword } = useChangePassword();
  const onSubmit = async (data: ChangePasswordSchema) => {
    toast.promise(changePassword(data), {
      loading: 'Đang cập nhật mật khẩu...',
      success: () => {
        form.reset();
        return 'Cập nhật mật khẩu thành công';
      },
      error: (err: AxiosError) => {
        if (err.response?.status === 400) {
          return 'Mật khẩu cũ không đúng';
        }
      },
    });
  };

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <InputForm control={form.control} name="currentPassword" label="Mật khẩu cũ" type="password" />
        <InputForm control={form.control} name="newPassword" label="Mật khẩu" type="password" />
        <InputForm control={form.control} name="rePassword" label="Nhập lại mật khẩu" type="password" />
        <div className="flex gap-2 justify-end">
          <Button.Root size="sm" intent="gray" type="reset" variant="outlined">
            <Button.Label>Hủy</Button.Label>
          </Button.Root>
          <Button.Root type="submit" size="sm">
            <Button.Label>Đổi mật khẩu</Button.Label>
          </Button.Root>
        </div>
      </form>
    </Form>
  );
}

export default ChangePassword;
