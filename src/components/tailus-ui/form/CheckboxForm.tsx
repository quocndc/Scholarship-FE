import Checkbox, { CheckboxProps } from '@components/tailus-ui/Checkbox';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@components/tailus-ui/form/Form';
import { cn } from '@lib/utils';
import { IconCheck } from '@tabler/icons-react';
import * as React from 'react';

export interface InputProps extends CheckboxProps {
  control: any;
  name: string;
  label: string;
}

const CheckboxForm = React.forwardRef<HTMLButtonElement, InputProps>(({ className, control, name, label, ...props }, ref) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn('flex items-center space-y-0 gap-2', className)}>
          <FormControl>
            <Checkbox.Root intent="primary" {...props} {...field} checked={field.value} onCheckedChange={(c) => field.onChange(c)}>
              <Checkbox.Indicator asChild>
                <IconCheck className="size-3.5" strokeWidth={3} />
              </Checkbox.Indicator>
            </Checkbox.Root>
          </FormControl>
          <FormLabel className="pt-0">{label}</FormLabel>

          <FormMessage />
        </FormItem>
      )}
    />
  );
});
CheckboxForm.displayName = 'CheckboxForm';

export { CheckboxForm };
