import Button from '@components/tailus-ui/Button';
import { Form, InputForm } from '@components/tailus-ui/form';
import { RetrySchema } from '@components/verify-form/verify.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

type ForgotFormProps = {
  onSuccess: (email: string) => void;
  header: React.ReactNode;
  button: {
    label: string;
    onClick?: () => void;
  };
};
function EmailForm(props: ForgotFormProps) {
  const { onSuccess, header, button } = props;
  const form = useForm<RetrySchema>({
    resolver: zodResolver(RetrySchema),
  });

  const { handleSubmit } = form;

  const onSubmit: SubmitHandler<RetrySchema> = (data, e) => {
    e?.preventDefault();
    onSuccess(data.email);
  };

  return (
    <Form {...form}>
      <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
        {header}
        <div className="flex gap-2 items-end">
          <InputForm label="Email" control={form.control} name="email" />
          <Button.Root type="submit" onClick={button.onClick}>
            <Button.Label>{button.label}</Button.Label>
          </Button.Root>
        </div>
      </form>
    </Form>
  );
}
export default EmailForm;
