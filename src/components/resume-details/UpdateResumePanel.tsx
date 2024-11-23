import Button from '@components/tailus-ui/Button';
import Card from '@components/tailus-ui/Card';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@components/tailus-ui/form';
import { Sheet, SheetBody, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@components/tailus-ui/Sheet';
import { Text } from '@components/tailus-ui/typography';
import { ACCEPTED_FILE_TYPES, MAX_UPLOAD_SIZE } from '@components/upload-cv/UploadCVDialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { Resume } from '@lib/types';
import { type DialogProps } from '@radix-ui/react-dialog';
import { IconCloudUpload, IconFileTypePdf, IconX } from '@tabler/icons-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const UpdateResumeSchema = z.object({
  id: z.string(),
  urlCv: z
    .instanceof(File, {
      message: 'File không hợp lệ, vui lòng chọn file pdf, jpg, png, jpeg',
    })
    .refine((file) => {
      return file.size <= MAX_UPLOAD_SIZE;
    }, 'File quá lớn, vui lòng chọn file nhỏ hơn 5MB')
    .refine((file) => {
      return ACCEPTED_FILE_TYPES.includes(file?.type);
    }, 'File không hợp lệ, vui lòng chọn file pdf, jpg, png, jpeg'),
});

export type UpdateResumeSchema = z.infer<typeof UpdateResumeSchema>;

type ResumeDetailPanel = {
  item?: Pick<Resume, '_id' | 'status'>;
  onSubmit: (data: UpdateResumeSchema) => void;
} & Omit<DialogProps, 'children'>;

export function UpdateResumePanel(props: ResumeDetailPanel) {
  const { item, ...rest } = props;
  const form = useForm<UpdateResumeSchema>({
    resolver: zodResolver(UpdateResumeSchema),
    defaultValues: {
      id: item?._id,
    },
  });

  useEffect(() => {
    form.reset({
      id: item?._id,
    });
  }, [form, item]);

  const onSubmit = (data: UpdateResumeSchema) => {
    props.onSubmit(data);
  };

  return (
    <Sheet {...rest}>
      <SheetContent size="lg" className="flex h-full flex-col gap-4 overflow-auto">
        <SheetHeader className="sticky top-0 z-[51] bg-white border-b py-7">
          <SheetTitle>Cập nhật trạng thái hồ sơ</SheetTitle>
        </SheetHeader>
        <SheetBody className="flex-1">
          <Form {...form}>
            <form id="update-status" className="flex-1 space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <input type="hidden" {...form.register('id')} />
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
                          <Text>{field.value.name}</Text>
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
        </SheetBody>
        <SheetFooter className="">
          <Button.Root type="reset" intent="gray" variant="outlined" onClick={() => form.reset()}>
            <Button.Label>Đặt lại</Button.Label>
          </Button.Root>
          <Button.Root type="submit" form="update-status">
            <Button.Label>Cập nhật</Button.Label>
          </Button.Root>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
