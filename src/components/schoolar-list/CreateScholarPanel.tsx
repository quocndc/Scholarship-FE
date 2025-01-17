import { ContinentOptions } from '@components/schoolar-list/constant';
import Button from '@components/tailus-ui/Button';
import Editor from '@components/tailus-ui/editor/editor';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, InputForm, SelectForm } from '@components/tailus-ui/form';
import { SwitchForm } from '@components/tailus-ui/form/SwitchForm';
import Select from '@components/tailus-ui/Select';
import { Sheet, SheetBody, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@components/tailus-ui/Sheet';
import { useUploadImage } from '@components/upload/useUploadImage';
import { zodResolver } from '@hookform/resolvers/zod';
import { type DialogProps } from '@radix-ui/react-dialog';
import { IconCheck, IconCloudUpload, IconTrash } from '@tabler/icons-react';
import { DialogProps as VariantProps } from '@tailus/themer';
import { TagInput } from 'emblor';
import { useEffect } from 'react';
import { useFieldArray, useForm, UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

export const CreateScholarSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(3).max(255),
  continent: z.string().min(3).max(255),
  major: z.array(z.string()).nonempty(),
  level: z.array(z.string()).nonempty(),
  location: z.string().min(3).max(255),
  description: z.string().min(3).max(5000),
  quantity: z.coerce.number().optional(),
  isActive: z.boolean().default(true),
  image: z
    .array(z.union([z.string().url(), z.instanceof(File)]))
    .min(1, {
      message: 'Chưa chọn ảnh',
    })
    .refine(
      (files) => {
        return files.every((file) => {
          if (typeof file === 'string') return true;
          return file.type.startsWith('image/');
        });
      },
      {
        message: 'File không phải là ảnh',
      }
    )
    .refine((files) => files.length <= 10, { message: 'Chỉ được tải lên tối đa 10 ảnh' })
    .refine(
      (files) =>
        files.reduce((acc, file) => {
          if (typeof file === 'string') return acc;
          return acc + file.size;
        }, 0) <=
        1024 * 1024 * 10,
      {
        message: 'Dung lượng ảnh tối đa 10MB',
      }
    ),
});
export type CreateScholarSchema = z.infer<typeof CreateScholarSchema>;

type CreateScholarPanelProps = {
  onSubmit: (data: CreateScholarSchema, form: UseFormReturn<CreateScholarSchema>) => Promise<void>;
  defaultValues?: Partial<CreateScholarSchema>;
} & VariantProps &
  Omit<DialogProps, 'children'>;

function CreateScholarPanel(props: CreateScholarPanelProps) {
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
  const form = useForm<CreateScholarSchema>({
    resolver: zodResolver(CreateScholarSchema),
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
            <SheetTitle>Tạo học bổng</SheetTitle>
          </SheetHeader>
          <SheetBody className="space-y-2 flex-1">
            <form className="space-y-4" onSubmit={form.handleSubmit((v) => onSubmit(v, form))} id="createform">
              <div className="grid grid-cols-[minmax(200px,_1fr)_100px] gap-2">
                <InputForm control={form.control} className={''} name="name" label="Tên học bổng" required />
                <InputForm control={form.control} name="quantity" required label="Số lượng" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <InputForm control={form.control} name="location" label="Loại học bổng" required />
                <SelectForm control={form.control} name="continent" label="Khu vực" required>
                  {ContinentOptions.map((country) => (
                    <SelectItem entry={country} key={country.value} />
                  ))}
                </SelectForm>
              </div>
              <FormField
                control={form.control}
                name={'level'}
                defaultValue={[] as any}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Cấp
                      <span className="text-danger-500 ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <TagInput
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
                        activeTagIndex={null}
                        // eslint-disable-next-line @typescript-eslint/no-empty-function
                        setActiveTagIndex={() => {}}
                        tags={field.value.map((v) => ({ id: v, text: v }))}
                        setTags={(newTags) => {
                          const value = (newTags as any).map((tag: Record<string, any>) => tag.text);
                          field.onChange(value);
                        }}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={'major'}
                defaultValue={[] as any}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Ngành học
                      <span className="text-danger-500 ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <TagInput
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
                        activeTagIndex={null}
                        // eslint-disable-next-line @typescript-eslint/no-empty-function
                        setActiveTagIndex={() => {}}
                        tags={field.value.map((v) => ({ id: v, text: v }))}
                        setTags={(newTags) => {
                          const value = (newTags as any).map((tag: Record<string, any>) => tag.text);
                          field.onChange(value);
                        }}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <SwitchForm control={form.control} name="isActive" label="Sử dụng học bổng" />
              <ImageForm control={form.control} name="image" label="Ảnh" required />
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
type Entry = {
  key?: string;
  value: string;
};

const SelectItem = ({ entry }: { entry: Entry }) => {
  return (
    <Select.Item value={entry.key ?? entry.value} className="pl-7 items-center">
      <Select.ItemIndicator asChild>
        <IconCheck className="size-3.5 text-secondary-500" />
      </Select.ItemIndicator>
      <Select.ItemText>{entry.value}</Select.ItemText>
    </Select.Item>
  );
};

export const ImageForm = ({ control, name, label, required }: { control: any; name: string; label: string; required?: boolean }) => {
  const { remove, append } = useFieldArray({
    control,
    name,
  });
  return (
    <FormField
      control={control}
      name={name}
      defaultValue={[] as any}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel htmlFor={field.name}>
            {label}
            {required && <span className="text-danger-500 ml-1">*</span>}
          </FormLabel>
          <div className="flex flex-wrap gap-2">
            <label htmlFor="image" className="size-40 rounded-btn border flex items-center justify-center text-xs text-caption flex-col">
              <IconCloudUpload className="size-5" />
              <span>Chọn ảnh</span>
            </label>
            {field.value?.map((file: File | string, index: number) =>
              typeof file === 'string' ? (
                <div key={file} className="relative group">
                  <img
                    src={file}
                    alt={file}
                    className="size-40 object-cover rounded-btn group-hover:brightness-75 transition-[brightness] duration-300 border"
                  />
                  <Button.Root
                    variant="outlined"
                    size="xs"
                    className="absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 origin-center opacity-0 group-hover:opacity-100"
                    intent="danger"
                    type="button"
                    onClick={() => {
                      remove(index);
                    }}
                  >
                    <Button.Icon type="only">
                      <IconTrash className="size-3.5" />
                    </Button.Icon>
                  </Button.Root>
                </div>
              ) : (
                <div key={file.name} className="relative group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="size-40 object-cover rounded-btn group-hover:brightness-75 transition-[brightness] duration-300 border"
                  />
                  <Button.Root
                    variant="outlined"
                    size="xs"
                    type="button"
                    className="absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 origin-center opacity-0 group-hover:opacity-100"
                    intent="danger"
                    onClick={() => {
                      remove(index);
                    }}
                  >
                    <Button.Icon type="only">
                      <IconTrash className="size-3.5" />
                    </Button.Icon>
                  </Button.Root>
                </div>
              )
            )}
          </div>
          <input
            hidden
            id="image"
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => {
              if (e.target.files) {
                const files = Array.from(e.target.files);
                files.forEach((file) => {
                  append(file);
                });
              }
            }}
          />
        </FormItem>
      )}
    />
  );
};
export { CreateScholarPanel };
