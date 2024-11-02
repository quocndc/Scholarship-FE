import EmailForm from '@components/forgot-form/EmailForm';
import ForgotForm from '@components/forgot-form/ForgotPasswordForm';
import { useForgotPassword } from '@components/forgot-form/useForgotPassword';
import { Caption, Title } from '@components/tailus-ui/typography';
import React from 'react';
import { toast } from 'sonner';

function ForgotPage() {
  const [email, setEmail] = React.useState<string>();
  const [resetMut] = useForgotPassword();

  const onSubmit = (email: string) => {
    const { mutateAsync: reset } = resetMut;
    toast.promise(reset({ email }), {
      loading: 'Đang gửi mã xác nhận...',
      success: (v) => {
        setEmail(v.data.email);
        return 'Gửi mã xác nhận thành công';
      },
      error: (err) => {
        Promise.reject(err.message);
        return err.message;
      },
    });
  };

  if (!email) {
    return (
      <EmailForm
        onSuccess={onSubmit}
        button={{
          label: 'Gửi mã',
        }}
        header={
          <>
            <Title className="text-center">Đặt lại mật khẩu</Title>
            <Caption className="text-center">Nhập email của bạn để đặt lại mật khẩu</Caption>
          </>
        }
      />
    );
  }

  return <ForgotForm onBack={() => setEmail(undefined)} data={{ email }} />;
}

export default ForgotPage;
