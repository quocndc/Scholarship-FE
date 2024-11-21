import Button from '@components/tailus-ui/Button';
import { Form, InputForm } from '@components/tailus-ui/form';
import { Sheet, SheetBody, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@components/tailus-ui/Sheet';
import { DialogProps } from '@radix-ui/react-dialog';
import { IconFilter } from '@tabler/icons-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type UserListFilterProps = Omit<DialogProps, 'children'> & {
  onSubmit: (data: UserFilter) => void;
};

export const FilterSchema = z
  .object({
    name: z.string().min(3),
    email: z.string().min(3),
    phone: z.string().min(3),
    address: z.string().min(3),
  })
  .partial();

export type UserFilter = z.infer<typeof FilterSchema>;

function UserTableFilter(props: UserListFilterProps) {
  const { onSubmit, ...rest } = props;
  const form = useForm<UserFilter>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
    },
  });

  const onFormSubmit = (data: UserFilter) => {
    onSubmit(data);
    rest.onOpenChange?.(false);
  };

  const onReset = async () => {
    form.reset();
  };

  const { handleSubmit } = form;

  return (
    <Sheet {...rest}>
      <SheetContent>
        <Form {...form}>
          <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col h-full gap-4">
            <SheetHeader className="border-b">
              <SheetTitle className="flex items-center gap-2">
                <IconFilter className="text-primary-500 size-4" />
                Bộ lọc
              </SheetTitle>
            </SheetHeader>

            <SheetBody className="flex-1 space-y-4">
              <InputForm control={form.control} name="name" label="Tên" />
              <InputForm control={form.control} name="email" label="Email" />
              <InputForm control={form.control} name="phone" label="Số điện thoại" />
              <InputForm control={form.control} name="address" label="Địa chỉ" />
            </SheetBody>
            <SheetFooter className="">
              <Button.Root type="reset" intent="gray" variant="outlined" onClick={onReset}>
                <Button.Label>Xóa</Button.Label>
              </Button.Root>
              <Button.Root type="submit">
                <Button.Label>Lưu</Button.Label>
              </Button.Root>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}

export { UserTableFilter };
