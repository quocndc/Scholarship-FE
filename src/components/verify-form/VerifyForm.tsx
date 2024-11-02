import Button from '@components/tailus-ui/Button';
import { Form } from '@components/tailus-ui/form';
import { OTPForm } from '@components/tailus-ui/form/OtpForm';
import { InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@components/tailus-ui/OTP';
import SeparatorRoot from '@components/tailus-ui/Separator';
import { Caption, Text, Title } from '@components/tailus-ui/typography';
import { useVerify } from '@components/verify-form/useVerify';
import { VerifySchema } from '@components/verify-form/verify.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffectOnce } from '@hooks/useEffectOnce';
import { IconArrowLeft } from '@tabler/icons-react';
import {} from '@uidotdev/usehooks';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type VerifyFormProps = {
  data: {
    _id?: string;
    email: string;
  };
};
function VerifyForm(props: VerifyFormProps) {
  const { data } = props;
  const go = useNavigate();
  const form = useForm<VerifySchema>({
    resolver: zodResolver(VerifySchema),
    defaultValues: {
      _id: data._id,
    },
  });

  const { handleSubmit } = form;
  const [verifyMut, retryMut] = useVerify();
  const { mutateAsync: verify } = verifyMut;
  const { mutateAsync: retry } = retryMut;

  const onSubmit: SubmitHandler<VerifySchema> = (data, e) => {
    e?.preventDefault();
    toast.promise(verify(data), {
      loading: 'Đang đăng ký...',
      success: () => {
        go('/login');
        return `Đăng ký tài khoản thành công`;
      },
      error: (err) => err.message,
    });
  };

  const onRetry = async () => {
    toast.promise(retry({ email: data.email }), {
      loading: 'Đang gửi mã xác nhận...',
      success: (v) => {
        form.setValue('_id', v.data._id);
        return 'Gửi mã xác nhận thành công';
      },
      error: (err) => {
        Promise.reject(err.message);
        return err.message;
      },
    });
  };

  useEffectOnce(() => {
    const id = form.getValues('_id');
    if (!id) {
      onRetry();
    }
  });

  return (
    <Form {...form}>
      <BackButton onBack={() => go('/register')} />
      <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
        <Title className="text-center">Xác thực tài khoản</Title>
        <Caption className="text-center">
          Mã xác nhận đã được gửi đến email <b>{data.email}</b>
        </Caption>
        <div className="space-y-4">
          <input {...form.register('_id')} type="hidden" value={data._id} />
          <OTPForm maxLength={6} name={'code'} control={form.control} className="mx-auto">
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </OTPForm>
        </div>
        <div className="space-y-2">
          <Button.Root type="submit" className="w-full">
            <Button.Label>Đăng ký</Button.Label>
          </Button.Root>
          <SeparatorRoot />
          <div className="flex gap-2">
            <Text className="text-nowrap">Chưa nhận được mã xác nhận?</Text>
            <ResendButton onRetry={onRetry} />
          </div>
        </div>
      </form>
    </Form>
  );
}

const ResendButton = ({ onRetry }: { onRetry: () => Promise<void> }) => {
  const [isSent, setIsSent] = React.useState(false);
  const [count, setCount] = React.useState(60);

  const onSend = async () => {
    setCount(60);
    setIsSent(true);
    try {
      onRetry();
      setTimeout(() => {
        setIsSent(false);
      }, 60000);
    } catch (err) {
      setIsSent(false);
    }
  };

  React.useEffect(() => {
    if (isSent) {
      const interval = setInterval(() => {
        setCount((c) => c - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isSent]);

  return (
    <Button.Root disabled={isSent} variant="ghost" type="button" className="w-full hover:bg-transparent h-fit min-w-[100px]" onClick={onSend}>
      <Button.Label>{isSent ? `(${count}s)` : 'Gửi lại'}</Button.Label>
    </Button.Root>
  );
};

const BackButton = ({ onBack }: { onBack: () => void }) => {
  return (
    <Button.Root size="sm" variant="ghost" type="button" className="absolute top-8 left-4" intent="gray" onClick={onBack}>
      <Button.Icon>
        <IconArrowLeft />
      </Button.Icon>
      <Button.Label>Quay lại</Button.Label>
    </Button.Root>
  );
};

export default VerifyForm;
