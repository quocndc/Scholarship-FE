import { ContinentOptions } from '@components/schoolar-list/constant';
import Button from '@components/tailus-ui/Button';
import Editor from '@components/tailus-ui/editor/editor';
import { Form, FormField, FormItem, FormLabel, InputForm, SelectForm } from '@components/tailus-ui/form';
import { SwitchForm } from '@components/tailus-ui/form/SwitchForm';
import { TagInputForm } from '@components/tailus-ui/form/TagInput';
import Select from '@components/tailus-ui/Select';
import { Sheet, SheetBody, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@components/tailus-ui/Sheet';
import { useUploadImage } from '@components/upload/useUploadImage';
import { zodResolver } from '@hookform/resolvers/zod';
import { type DialogProps } from '@radix-ui/react-dialog';
import { IconCheck, IconCloudUpload, IconTrash } from '@tabler/icons-react';
import { DialogProps as VariantProps } from '@tailus/themer';
import { useEffect } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

export const CreateScholarSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(3).max(255),
  continent: z.string().min(3).max(255),
  major: z
    .array(
      // serve for tag input
      // it will be converted to string[]
      z.object({
        id: z.string().optional(),
        text: z.string().min(1).max(255),
      })
    )
    .nonempty(),
  level: z
    .array(
      // serve for tag input
      // it will be converted to string[]
      z.object({
        id: z.string().optional(),
        text: z.string().min(1).max(255),
      })
    )
    .nonempty(),
  location: z.string().min(3).max(255),
  description: z.string().min(3).max(5000),
  quantity: z.coerce.number().optional(),
  isActive: z.boolean().default(true),
  image: z
    .array(z.instanceof(File))
    .refine((files) => files.every((file) => file.type.startsWith('image/')), {
      message: 'File không phải là ảnh',
    })
    .refine((files) => files.length <= 10, { message: 'Chỉ được tải lên tối đa 10 ảnh' })
    .refine((files) => files.reduce((acc, file) => acc + file.size, 0) <= 1024 * 1024 * 10, {
      message: 'Dung lượng ảnh tối đa 10MB',
    }),
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
    if (!defaultValues) return;

    if (typeof defaultValues?.image?.[0] === 'string') {
      // if image is string, convert to file
      const files = defaultValues.image.map((url: any) => {
        const filename = url.split('/').pop();
        return new File([filename], filename, { type: 'image/png' });
      });

      return form.reset({
        ...defaultValues,
        image: files,
      });
    }
    return form.reset(defaultValues);
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
              <TagInputForm control={form.control} name="level" label="Cấp" required />
              <TagInputForm control={form.control} name="major" label="Ngành học" required />
              <SwitchForm control={form.control} name="isActive" label="Sử dụng học bổng" />
              <FormField
                control={form.control}
                name="image"
                defaultValue={[] as any}
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel htmlFor={field.name}>Hình ảnh</FormLabel>
                    <div className="flex flex-wrap gap-2">
                      <label htmlFor="image" className="size-40 rounded-btn border flex items-center justify-center text-xs text-caption flex-col">
                        <IconCloudUpload className="size-5" />
                        <span>Chọn ảnh</span>
                      </label>
                      {field.value?.map((file: File) => (
                        <div key={file.name} className="relative group">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="size-40 object-cover rounded-btn group-hover:brightness-75 transition-[brightness] duration-300 border"
                          />
                          <Button.Root
                            variant="outlined"
                            size="xs"
                            className="absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 origin-center opacity-0 group-hover:opacity-100"
                            intent="danger"
                            onClick={() => {
                              field.onChange(field.value.filter((f) => f !== file));
                            }}
                          >
                            <Button.Icon type="only">
                              <IconTrash className="size-3.5" />
                            </Button.Icon>
                          </Button.Root>
                        </div>
                      ))}
                    </div>
                    <input
                      hidden
                      id="image"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files) {
                          field.onChange(
                            [...field.value, ...Array.from(e.target.files)].filter((file, index, self) => {
                              return index === self.findIndex((f) => f.name === file.name);
                            })
                          );
                        }
                      }}
                    />
                  </FormItem>
                )}
              />
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
            <Button.Root form="createform" intent="gray" variant="outlined" onClick={() => form.reset()}>
              <Button.Label>Đặt lại</Button.Label>
            </Button.Root>
            <Button.Root form="createform" type="submit">
              <Button.Label>Tạo mới</Button.Label>
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
export { CreateScholarPanel };
