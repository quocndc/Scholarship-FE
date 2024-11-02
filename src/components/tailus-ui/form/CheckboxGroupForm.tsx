import Checkbox, { CheckboxProps } from '@components/tailus-ui/Checkbox';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@components/tailus-ui/form/Form';
import { cn } from '@lib/utils';
import { IconCheck } from '@tabler/icons-react';
import * as React from 'react';

export interface CheckboxGroupProps extends CheckboxProps {
  control: any;
  name: string;
  label: string;
  values: { key?: string; value: string }[];
}

const CheckboxGroupForm = React.forwardRef<HTMLButtonElement, CheckboxGroupProps>(({ className, control, name, label, values, ...props }, ref) => {
  return (
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormItem className={cn('', className)}>
          <FormLabel className="pt-0">{label}</FormLabel>
          <div className="grid grid-cols-2 gap-2">
            {values.map((item) => (
              <FormField
                key={item.key}
                control={control}
                defaultValue={[]}
                name={name}
                render={({ field }) => {
                  return (
                    <FormItem key={item.key} className="flex items-center gap-1">
                      <FormControl>
                        <Checkbox.Root
                          {...field}
                          intent="primary"
                          checked={field.value?.includes(item.key ?? item.value)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...field.value, item.key ?? item.value])
                              : field.onChange(field.value?.filter((value: string) => value !== (item.key ?? item.value)));
                          }}
                        >
                          <Checkbox.Indicator>
                            <IconCheck className="size-3.5" />
                          </Checkbox.Indicator>
                        </Checkbox.Root>
                      </FormControl>
                      <FormLabel className="text-sm font-normal">{item.value}</FormLabel>
                    </FormItem>
                  );
                }}
              />
            ))}
          </div>

          <FormMessage />
        </FormItem>
      )}
    />
  );
});
CheckboxGroupForm.displayName = 'CheckboxForm';

export { CheckboxGroupForm };
