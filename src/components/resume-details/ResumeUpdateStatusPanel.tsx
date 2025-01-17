import StatusBadge from '@components/resume-details/StatusBadge';
import { useGetResumeDetails } from '@components/resume-details/useGetResumeDetails';
import Button from '@components/tailus-ui/Button';
import Card from '@components/tailus-ui/Card';
import { Form, FormField, FormItem, FormLabel, FormMessage, InputForm, SelectForm, SelectItem } from '@components/tailus-ui/form';
import { Sheet, SheetBody, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@components/tailus-ui/Sheet';
import { Caption, Link, Text } from '@components/tailus-ui/typography';
import { ACCEPTED_FILE_TYPES, MAX_UPLOAD_SIZE } from '@components/upload-cv/UploadCVDialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUser } from '@lib/auth';
import { Resume, ResumeStatus } from '@lib/types';
import { type DialogProps } from '@radix-ui/react-dialog';
import { IconCloudUpload, IconFileTypePdf, IconX } from '@tabler/icons-react';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const UpdateResumeStatusSchema = z.object({
  id: z.string(),
  status: z.string().min(1).optional(),
  note: z.string().optional(),
  urlCv: z
    .instanceof(File, {
      message: 'File không hợp lệ, vui lòng chọn file pdf, jpg, png, jpeg',
    })
    .nullable()
    .refine((file) => {
      if (!file) return true;
      return file.size <= MAX_UPLOAD_SIZE;
    }, 'File quá lớn, vui lòng chọn file nhỏ hơn 5MB')
    .refine((file) => {
      if (!file) return true;
      return ACCEPTED_FILE_TYPES.includes(file?.type);
    }, 'File không hợp lệ, vui lòng chọn file pdf, jpg, png, jpeg'),
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
      status: ResumeStatus['Hoàn chỉnh hồ sơ'],
    },
  });

  const { data } = useGetResumeDetails(item?._id ?? '', {
    enabled: !!item && rest.open,
  });

  useEffect(() => {
    form.reset({
      id: item?._id,
      status: item?.status,
      note: '',
      urlCv: null,
    });
  }, [form, item]);

  const onSubmit = (data: UpdateResumeStatusSchema) => {
    props.onSubmit(data);
  };

  const user = useUser();

  const statusOptions = useMemo(() => {
    if (user?.provider) {
      return [ResumeStatus['Hồ sơ đã đậu'], ResumeStatus['Hồ sơ chưa đậu']].map((status) => (
        <SelectItem key={status} value={status}>
          {status}
        </SelectItem>
      ));
    }
    return Object.values(ResumeStatus).map((status) => (
      <SelectItem key={status} value={status}>
        {status}
      </SelectItem>
    ));
  }, [user?.provider]);

  return (
    <Sheet {...rest}>
      <SheetContent size="lg" className="flex h-full flex-col gap-4 overflow-auto">
        <SheetHeader className="sticky top-0 z-[51] bg-white border-b py-7">
          <SheetTitle>Cập nhật trạng thái hồ sơ</SheetTitle>
          <SheetDescription>
            {data?.status === ResumeStatus['Hồ sơ thành công'] && 'Hồ sơ đã đậu và đã hoàn thành, không thể cập nhật trạng thái'}
          </SheetDescription>
        </SheetHeader>
        <fieldset disabled={data?.status === ResumeStatus['Hồ sơ thành công']}>
          <SheetBody className="flex-1">
            <Form {...form}>
              <form id="update-status" className="flex-1 space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                <SelectForm
                  label="Trạng thái"
                  control={form.control}
                  required
                  name="status"
                  disabled={data?.status === ResumeStatus['Hồ sơ thành công']}
                >
                  {statusOptions}
                </SelectForm>
                <input type="hidden" {...form.register('id')} />
                <InputForm control={form.control} name="note" label="Ghi chú" />
                <FormField
                  control={form.control}
                  name="urlCv"
                  defaultValue={[] as any}
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel htmlFor={field.name}>File CV</FormLabel>
                      <div className="flex flex-wrap gap-2">
                        {field.value?.name ? (
                          <Card variant="outlined" className="flex gap-3 items-center w-full relative">
                            <div className="rounded-full bg-soft-bg aspect-square w-14 flex items-center justify-center">
                              <IconFileTypePdf className="size-6 opacity-35" />
                            </div>
                            <Text>{field.value?.name}</Text>
                            <Button.Root
                              size={'xs'}
                              className="absolute top-0 right-0"
                              intent="gray"
                              variant="ghost"
                              onClick={() => field.onChange(undefined)}
                            >
                              <Button.Icon type="only">
                                <IconX />
                              </Button.Icon>
                            </Button.Root>
                          </Card>
                        ) : (
                          <label
                            htmlFor="cv"
                            className="w-full h-40 rounded-btn border flex items-center justify-center text-xs text-caption flex-col mx-auto"
                          >
                            <IconCloudUpload className="size-5" />
                            <span>Chọn file (pdf, doc,docx)</span>
                          </label>
                        )}
                      </div>
                      <input
                        hidden
                        id="cv"
                        type="file"
                        accept=".pdf,image/*"
                        onChange={(e) => {
                          if (e.target.files) {
                            field.onChange(e.target.files[0]);
                          }
                        }}
                      />

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
            <div className="space-y-2">
              <Text weight={'bold'}>Lịch sử</Text>
              <div className="space-y-4">
                {data?.history.map((h, i) => (
                  <div key={i}>
                    <div key={i} className="flex items-center gap-2">
                      <Caption size="xs">{Intl.DateTimeFormat('vi-VN').format(new Date(h.updatedAt))}</Caption>
                      <div>
                        <Text size="sm">{h.updatedBy.email}</Text>
                        <StatusBadge status={h.status} />
                      </div>
                    </div>
                    {h.note && (
                      <div>
                        <Text size="sm">
                          <span className="font-medium">Note:</span> {h.note}
                        </Text>
                      </div>
                    )}
                    {h.urlCV && (
                      <div>
                        <Text size="sm">
                          <span className="font-medium">URL CV:</span> <Link href={h.urlCV}>{h.urlCV.split('/').pop()}</Link>
                        </Text>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </SheetBody>
          <SheetFooter className="">
            <Button.Root type="reset" intent="gray" variant="outlined" onClick={() => form.reset()}>
              <Button.Label>Đặt lại</Button.Label>
            </Button.Root>
            <Button.Root type="submit" form="update-status">
              <Button.Label>Cập nhật</Button.Label>
            </Button.Root>
          </SheetFooter>
        </fieldset>
      </SheetContent>
    </Sheet>
  );
}
