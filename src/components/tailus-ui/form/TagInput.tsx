import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@components/tailus-ui/form/Form';
import { InputProps as PIProps } from '@components/tailus-ui/Input';
import { TagInput } from 'emblor';
import * as React from 'react';

export interface InputProps extends PIProps {
  control: any;
  name: string;
  required?: boolean;
  label: string;
}

const TagInputForm = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, control, name, label, required, ...props }, ref) => {
  const [activeTagIndex, setActiveTagIndex] = React.useState<number | null>(null);
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
            <TagInput
              {...field}
              styleClasses={{
                input: 'placeholder:text-caption rounded-none focus:ring-0 focus-visible:ring-0 focus-visible:border-0 focus:outline-none',
                inlineTagsContainer: '!rounded-btn focus:ring-0 focus-visible:ring-0 focus-visible:border-0 focus:outline-none',
                tagList: {
                  container: 'border-red-500',
                },
                tag: {
                  body: '!rounded-card bg-soft-bg',
                },
              }}
              activeTagIndex={activeTagIndex}
              setActiveTagIndex={setActiveTagIndex}
              tags={field.value ?? []}
              setTags={(newTags) => {
                field.onChange(newTags);
              }}
            />
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
});
TagInputForm.displayName = 'TagInput';

export { TagInputForm };
