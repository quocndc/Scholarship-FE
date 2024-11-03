import Button from '@components/tailus-ui/Button';
import { Form, SelectForm, SelectItem } from '@components/tailus-ui/form';
import { Sheet, SheetBody, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@components/tailus-ui/Sheet';
import { zodResolver } from '@hookform/resolvers/zod';
import { Resume, ResumeStatus } from '@lib/types';
import { type DialogProps } from '@radix-ui/react-dialog';
import { IconPointFilled } from '@tabler/icons-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const UpdateResumeStatusSchema = z.object({
  id: z.string(),
  status: z.enum([ResumeStatus.REJECTED, ResumeStatus.REVIEWING, ResumeStatus.DONE]),
});

export type UpdateResumeStatusSchema = z.infer<typeof UpdateResumeStatusSchema>;

type ResumeDetailPanel = {
  item?: Pick<Resume, '_id' | 'status'>;
  onSubmit: (data: UpdateResumeStatusSchema) => void;
} & Omit<DialogProps, 'children'>;

export function ResumeUpdateStatusPanel(props: ResumeDetailPanel) {
  const { item, ...rest } = props;
  const form = useForm<UpdateResumeStatusSchema>({
    resolver: zodResolver(UpdateResumeStatusSchema),
    defaultValues: {
      id: item?._id,
      status: ResumeStatus.REVIEWING,
    },
  });

  useEffect(() => {
    form.reset({
      id: item?._id,
      status: ResumeStatus.REVIEWING,
    });
  }, [form, item]);

  const onSubmit = (data: UpdateResumeStatusSchema) => {
    props.onSubmit(data);
  };

  return (
    <Sheet {...rest}>
      <SheetContent size="lg" className="flex h-full flex-col gap-4 overflow-auto">
        <SheetHeader className="sticky top-0 z-[51] bg-white border-b py-7">
          <SheetTitle>Cập nhật trạng thái hồ sơ</SheetTitle>
          <SheetDescription>
            {item?.status === ResumeStatus.PENDING ? 'Hồ sơ đang chờ xử lý bạn không thể cập nhật' : 'Cập nhật trạng thái hồ sơ'}
          </SheetDescription>
        </SheetHeader>
        <SheetBody className="flex-1">
          <Form {...form}>
            <form id="update-status" className="flex-1" onSubmit={form.handleSubmit(onSubmit)}>
              <SelectForm label="Trạng thái" control={form.control} name="status" disabled={item?.status === ResumeStatus.PENDING}>
                <SelectItem value={ResumeStatus.REJECTED}>
                  <IconPointFilled className="inline-block size-5 mr-2 text-danger-500" />
                  Từ chối
                </SelectItem>
                <SelectItem value={ResumeStatus.REVIEWING}>
                  <IconPointFilled className="inline-block size-5 mr-2 text-warning-500" />
                  Đang xem xét
                </SelectItem>
                <SelectItem value={ResumeStatus.DONE}>
                  <IconPointFilled className="inline-block size-5 mr-2 text-success-500" />
                  Hoàn thành
                </SelectItem>
              </SelectForm>
              <input type="hidden" {...form.register('id')} />
            </form>
          </Form>
        </SheetBody>
        <SheetFooter className="">
          <Button.Root type="reset" intent="gray" variant="outlined" onClick={() => form.reset()}>
            <Button.Label>Xóa</Button.Label>
          </Button.Root>
          <Button.Root type="submit" form="update-status">
            <Button.Label>Lưu</Button.Label>
          </Button.Root>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
