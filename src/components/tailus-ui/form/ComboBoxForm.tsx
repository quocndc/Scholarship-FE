import Button from '@components/tailus-ui/Button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@components/tailus-ui/Command';
import { FormField, FormItem, FormLabel, FormMessage } from '@components/tailus-ui/form/Form';
import Popover from '@components/tailus-ui/Popover';
import { cn } from '@lib/utils';
import { IconCaretDown, IconCheck } from '@tabler/icons-react';
import { useDebounce } from '@uidotdev/usehooks';
import { Command as CommandPrimitive } from 'cmdk';
import React, { useEffect } from 'react';

interface SelectFormProps extends Partial<React.ComponentPropsWithoutRef<typeof CommandPrimitive>> {
  control: any;
  name: string;
  placeholder?: string;
  classname?: string;
  label: string;
  required?: boolean;
  options?: { id: string; text: string }[];
  emptyText?: string;
  debounce?: number;
  onSearch?: (search: string) => void;
  popover?: {
    root: string;
    content: string;
  };
}

export function ComboBoxForm({
  control,
  emptyText,
  options,
  debounce = 2000,
  required,
  className,
  name,
  placeholder = 'Select...',
  label,
  onSearch,
  popover,
  ...props
}: SelectFormProps) {
  const [search, setSearch] = React.useState('');
  const debouncedSearchTerm = useDebounce(search, debounce);

  useEffect(() => {
    onSearch?.(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearch]);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn(className)}>
          <FormLabel>
            {label}
            {required && <span className="text-danger-500 ml-1">*</span>}
          </FormLabel>
          <Popover.Root modal>
            <Popover.Trigger asChild>
              <Button.Root
                variant="outlined"
                role="combobox"
                intent="gray"
                className={cn(
                  field.value && 'text-caption',
                  'w-full text-start justify-between text-sm [&>span]:text-ellipsis [&>span]:overflow-hidden [&>span]:text-nowrap [&>span]:max-w-full'
                )}
              >
                <Button.Label>{field.value ? options?.find((o) => o.id === field.value)?.text : placeholder}</Button.Label>
                <Button.Icon type="trailing">
                  <IconCaretDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button.Icon>
              </Button.Root>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content fancy className={cn('max-w-xs z-[13] p-0 relative w-[320px]', popover?.content)}>
                <Command
                  className="w-full"
                  shouldFilter={false}
                  {...props}
                  onValueChange={(v) => {
                    console.log(v);
                    field.onChange(v);
                  }}
                >
                  <CommandInput value={search} onValueChange={setSearch} placeholder="Search framework..." className="h-9" />
                  <CommandList>
                    <CommandEmpty>{emptyText}</CommandEmpty>
                    <CommandGroup>
                      {options?.map((language) => (
                        <CommandItem
                          value={language.id}
                          key={language.id}
                          onSelect={() => {
                            field.onChange(language.id);
                          }}
                        >
                          {language.text}
                          <IconCheck className={cn('ml-auto h-4 w-4', language.id === field.value ? 'opacity-100' : 'opacity-0')} />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
