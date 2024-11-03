import Aligner from '@components/tailus-ui/Aligner';
import { FormField, FormItem, FormLabel, FormMessage } from '@components/tailus-ui/form/Form';
import Switch from '@components/tailus-ui/Switch';
import { cn } from '@lib/utils';
import { SwitchProps } from '@tailus/themer';

interface SwitchForm extends SwitchProps {
  control: any;
  name: string;
  className?: string;
  label: string;
  required?: boolean;
}

export function SwitchForm({ control, required, className, name, label, ...props }: SwitchForm) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn(className)}>
          <Aligner className="max-w-md justify-center">
            <Switch.Root className="mt-1" checked={field.value} onCheckedChange={(v) => field.onChange(v)} {...props}>
              <Switch.Thumb />
            </Switch.Root>
            <FormLabel>
              {label}
              {required && <span className="text-danger-500 ml-1">*</span>}
            </FormLabel>
          </Aligner>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
