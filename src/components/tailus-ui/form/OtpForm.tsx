import { FormControl, FormField, FormItem, FormMessage } from '@components/tailus-ui/form/Form';
import { InputOTP } from '@components/tailus-ui/OTP';
import { OTPInput } from 'input-otp';
import * as React from 'react';

export type OTPProps = Omit<React.ComponentPropsWithoutRef<typeof OTPInput>, 'render'> & {
  control: any;
  name: string;
};

const OTPForm = React.forwardRef<HTMLInputElement, OTPProps>(({ type, control, name, children, ...props }, ref) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-fit mx-auto">
          <FormControl>
            <InputOTP {...props} {...field}>
              {children}
            </InputOTP>
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
});
OTPForm.displayName = 'Input';

export { OTPForm };
