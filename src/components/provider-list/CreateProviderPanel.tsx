import Button from '@components/tailus-ui/Button';
import Editor from '@components/tailus-ui/editor/editor';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, InputForm } from '@components/tailus-ui/form';
import Label from '@components/tailus-ui/Label';
import { Sheet, SheetBody, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@components/tailus-ui/Sheet';
import Textarea from '@components/tailus-ui/Textare';
import { Tooltip } from '@components/tailus-ui/Tooltip';
import { useUploadImage } from '@components/upload/useUploadImage';
import { zodResolver } from '@hookform/resolvers/zod';
import { type DialogProps } from '@radix-ui/react-dialog';
import { IconCloudUpload, IconInfoCircleFilled, IconTrash } from '@tabler/icons-react';
import { DialogProps as VariantProps } from '@tailus/themer';
import { useCallback, useEffect } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

export const CreateProviderSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1).max(255),
  description: z.string().min(1).max(255),
  address: z.array(z.string().min(1).max(255)),
  background: z
    .union([z.string().url(), z.instanceof(File)])
    .refine(
      (file) => {
        if (typeof file === 'string') return true;
        return file.type.startsWith('image/');
      },
      {
        message: 'File không phải là ảnh',
      }
    )
    .refine(
      (file) => {
        if (typeof file === 'string') return true;
        return file.size <= 10 * 1024 * 1024;
      },
      {
        message: 'Dung lượng ảnh tối đa 10MB',
      }
    ),
  logo: z
    .union([z.string().url(), z.instanceof(File)])
    .refine(
      (file) => {
        if (typeof file === 'string') return true;
        return file.type.startsWith('image/');
      },
      {
        message: 'File không phải là ảnh',
      }
    )
    .refine(
      (file) => {
        if (typeof file === 'string') return true;
        return file.size <= 10 * 1024 * 1024;
      },
      {
        message: 'Dung lượng ảnh tối đa 10MB',
      }
    ),
});
export type CreateProviderSchema = z.infer<typeof CreateProviderSchema>;

type CreateScholarPanelProps = {
  onSubmit: (data: CreateProviderSchema, form: UseFormReturn<CreateProviderSchema>) => Promise<void>;
  defaultValues?: Partial<CreateProviderSchema>;
} & VariantProps &
  Omit<DialogProps, 'children'>;

export function CreateProviderPanel(props: CreateScholarPanelProps) {
  const { defaultValues, onSubmit, ...rest } = props;
  const { mutateAsync } = useUploadImage();
  const handleUploadImage = async (file: File) => {
    return new Promise<string>((resolve, reject) => {
      if (!file) {
        toast.error('File không tồn tại');
        return reject('File không tồn tại');
      }
      toast.promise(mutateAsync(file), {
        loading: 'Đang tải ảnh lên...',
        success: (data) => {
          resolve(data.url);
          return 'Tải ảnh lên thành công';
        },
        error: (error) => {
          reject(error);
          return 'Tải ảnh lên thất bại';
        },
      });
    });
  };
  const form = useForm<CreateProviderSchema>({
    resolver: zodResolver(CreateProviderSchema),
    defaultValues: defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  return (
    <Sheet {...rest}>
      <SheetContent size="3xl" className="flex h-full flex-col gap-4 overflow-y-auto">
        <Form {...form}>
          <SheetHeader>
            <SheetTitle>{defaultValues?._id ? 'Cập nhật nhà cung cấp' : 'Tạo mới nhà cung cấp'}</SheetTitle>
          </SheetHeader>
          <SheetBody className="space-y-2 flex-1">
            <form className="space-y-4" onSubmit={form.handleSubmit((v) => onSubmit(v, form))} id="createform">
              <InputForm control={form.control} className={''} name="name" label="Tên" required />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={field.name}>Mô tả</FormLabel>
                    <Editor onUploadImg={handleUploadImage} content={field.value} onChange={field.onChange} />
                  </FormItem>
                )}
              />
              <ImageForm key={'bg'} control={form.control} name="background" label="Ảnh nền" required />
              <ImageForm key={'logo'} control={form.control} name="logo" label="Logo" required />

              <FormField
                control={form.control}
                name="address"
                defaultValue={[]}
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-1">
                      <Tooltip tooltip={'Địa chỉ của nhà cung cấp, cách nhau bằng xuống dòng'}>
                        <IconInfoCircleFilled className="size-5 text-primary-500" />
                      </Tooltip>
                      <Label>Địa chỉ</Label>
                    </div>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder={`123 Đường 3/2, P.12, Q.10, TP.HCM\n123 Đường 3/2\nP.12, Q.10, TP.HCM`}
                        value={field.value.join('\n')}
                        onChange={(e) => {
                          field.onChange(e.target.value.split('\n'));
                        }}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </SheetBody>
          <SheetFooter>
            <Button.Root type="reset" form="createform" intent="gray" variant="outlined" onClick={() => form.reset()}>
              <Button.Label>Đặt lại</Button.Label>
            </Button.Root>
            <Button.Root form="createform" type="submit">
              <Button.Label>{defaultValues?._id ? 'Cập nhật' : 'Tạo mới'}</Button.Label>
            </Button.Root>
          </SheetFooter>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
export const ImageForm = ({ control, name, label, required }: { control: any; name: string; label: string; required?: boolean }) => {
  const renderValue = useCallback(
    (field: any) => {
      if (!field.value) return null;
      return typeof field.value === 'string' ? (
        <div>
          <img
            src={field.value}
            alt={field.value}
            className="size-40 object-cover rounded-btn group-hover:brightness-75 transition-[brightness] duration-300 border"
          />
          <Button.Root
            variant="outlined"
            size="xs"
            className="absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 origin-center opacity-0 group-hover:opacity-100"
            intent="danger"
            type="button"
            onClick={() => {
              field.onChange();
            }}
          >
            <Button.Icon type="only">
              <IconTrash className="size-3.5" />
            </Button.Icon>
          </Button.Root>
        </div>
      ) : (
        <div className="relative group">
          <img
            src={URL.createObjectURL(field.value)}
            alt={field.value.name}
            key={name}
            className="size-40 object-cover rounded-btn group-hover:brightness-75 transition-[brightness] duration-300 border"
          />
          <Button.Root
            variant="outlined"
            size="xs"
            type="button"
            className="absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 origin-center opacity-0 group-hover:opacity-100"
            intent="danger"
            onClick={() => {
              field.onChange();
            }}
          >
            <Button.Icon type="only">
              <IconTrash className="size-3.5" />
            </Button.Icon>
          </Button.Root>
        </div>
      );
    },
    [name]
  );

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel htmlFor={field.name}>
            {label}
            {required && <span className="text-danger-500 ml-1">*</span>}
          </FormLabel>
          <div className="flex flex-wrap gap-2">
            {field.value ? (
              renderValue(field)
            ) : (
              <label htmlFor={name} className="size-40 rounded-btn border flex items-center justify-center text-xs text-caption flex-col">
                <IconCloudUpload className="size-5" />
                <span>Chọn ảnh</span>
              </label>
            )}
          </div>
          <input
            hidden
            id={name}
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => {
              if (e.target.files) {
                const files = Array.from(e.target.files);
                field.onChange(files[0]);
              }
            }}
          />
        </FormItem>
      )}
    />
  );
};
