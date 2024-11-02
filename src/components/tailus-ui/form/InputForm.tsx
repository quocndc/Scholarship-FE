import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@components/tailus-ui/form/Form';
import Input, { InputProps as PIProps } from '@components/tailus-ui/Input';
import * as React from 'react';

export interface InputProps extends PIProps {
  control: any;
  name: string;
  required?: boolean;
  label: React.ReactNode;
}

const InputForm = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, control, name, label, required, ...props }, ref) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>
            {label}
            {required && <span className="text-danger-500 ml-1">*</span>}
          </FormLabel>
          <FormControl>
            <Input type={type} {...field} ref={ref} {...props} />
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
});
InputForm.displayName = 'Input';

export { InputForm };
