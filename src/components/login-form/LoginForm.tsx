import { usePromt } from '@components/ConfirmDialog';
import { LoginSchema } from '@components/login-form/login.schema';
import { useLogin } from '@components/login-form/useLogin';
import Button from '@components/tailus-ui/Button';
import { CheckboxForm, Form, InputForm } from '@components/tailus-ui/form';
import Label from '@components/tailus-ui/Label';
import SeparatorRoot from '@components/tailus-ui/Separator';
import { Link, Title } from '@components/tailus-ui/typography';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

function LoginForm() {
  const go = useNavigate();
  const { dialog } = usePromt();
  const form = useForm<LoginSchema>({
    defaultValues: {
      username: '',
      password: '',
      save: true,
    },
    resolver: zodResolver(LoginSchema),
  });

  const { handleSubmit } = form;
  const { mutateAsync: login } = useLogin();

  const onSubmit: SubmitHandler<LoginSchema> = (data, e) => {
    e?.preventDefault();
    toast.promise(login(data), {
      loading: 'Đang đăng nhập...',
      success: (data) => {
        go('/');
        return `Đăng nhập thành công với tên ${data.data.user.name}`;
      },
      error: async (e) => {
        console.log(e);
        if (e instanceof AxiosError) {
          if (e.response?.status === 401) {
            return 'Sai tên đăng nhập hoặc mật khẩu';
          }

          if (e.response?.status === 400) {
            // need to active account
            dialog({
              title: 'Tài khoản chưa được kích hoạt',
              description: 'Vui lòng kích hoạt tài khoản trước khi đăng nhập',
              confirmLabel: 'Kích hoạt',
              cancelLabel: 'Hủy',
            }).then((willVerify) => {
              if (willVerify) {
                go('/verify?email=' + data.username);
              }
            });
          }

          return e.message;
        }
      },
    });
  };

  return (
    <Form {...form}>
      <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
        <Title className="text-center">Đăng nhập</Title>
        <div className="space-y-4 min-w-[400px]">
          <InputForm label="Email" control={form.control} name="username" />
          <InputForm
            label={
              <div className="flex justify-between items-center">
                <Label>Mật khẩu</Label>
                <Link variant="ghost" size="sm" intent="gray" href="/forgot-password">
                  Quên mật khẩu
                </Link>
              </div>
            }
            control={form.control}
            name="password"
            type="password"
          />
          <CheckboxForm label="Ghi nhớ tôi" control={form.control} name="save" className="justify-end" />
        </div>
        <div className="space-y-2">
          <Button.Root type="submit" size="sm" className="w-full">
            <Button.Label>Đăng nhập</Button.Label>
          </Button.Root>
          <SeparatorRoot />
          <Button.Root variant="ghost" size="sm" type="button" className="w-full" href="/register">
            <Button.Label>Đăng ký</Button.Label>
          </Button.Root>
        </div>
      </form>
    </Form>
  );
}

export default LoginForm;
