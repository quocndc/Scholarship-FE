import { useCreateAdvisory } from '@components/advisory/useCreateAdvisory';
import Button from '@components/tailus-ui/Button';
import Dialog from '@components/tailus-ui/Dialog';
import { Form, InputForm } from '@components/tailus-ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconSend, IconX } from '@tabler/icons-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
export const AdvisorSchema = z.object({
  fullName: z.string().min(3).max(255),
  emailAdvisory: z.string().email(),
  phone: z.coerce.number().min(10),
  address: z.string().default(''),
  time: z.coerce.string().default(new Date().toString()),
  level: z.string(),
  pay: z.string().default(''),
});
export type AdvisorSchema = z.infer<typeof AdvisorSchema>;

function AdvisorContactDialog() {
  const { mutateAsync: createAdvisory } = useCreateAdvisory();
  const form = useForm<AdvisorSchema>({
    resolver: zodResolver(AdvisorSchema),
  });

  const onSubmit = async (data: AdvisorSchema) => {
    toast.promise(createAdvisory(data), {
      success: 'Đã gửi đơn tới chuyên gia, chúng tôi sẽ liên hệ với bạn sớm nhất có thể',
      error: 'OOps, có lỗi xảy ra, vui lòng thử lại sau',
    });
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button.Root intent="secondary" size="lg">
          <Button.Label>Đăng ký tư vấn</Button.Label>
        </Button.Root>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="z-[11]" />
        <Dialog.Content className="w-[30vw] z-[11]">
          <Dialog.Title>Đăng ký tư vấn</Dialog.Title>
          <Dialog.Description className="mt-2">Đăng ký tư vấn để nhận được sự hỗ trợ từ chuyên gia của chúng tôi.</Dialog.Description>
          <Form {...form}>
            <form className="mt-4 space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <InputForm control={form.control} name="fullName" label="Họ và tên" />
              <InputForm control={form.control} name="emailAdvisory" label="Email" />
              <div className="grid grid-cols-2 gap-4">
                <InputForm type="number" control={form.control} name="phone" label="Số điện thoại" />
                <InputForm type="datetime-local" control={form.control} name="time" label="Thời gian bạn có thể nghe tư vấn" />
              </div>
              <InputForm control={form.control} name="address" label="Địa chỉ" />
              <InputForm control={form.control} name="level" label="Trình độ bạn muốn học bổng" />
              <InputForm control={form.control} name="pay" label="Hình thức thanh toán học bổng" />

              <Dialog.Actions>
                <Dialog.Close asChild>
                  <Button.Root variant="ghost" size="sm" intent="gray" className="rounded-full absolute top-0 right-0 origin-center">
                    <Button.Icon type="only">
                      <IconX />
                    </Button.Icon>
                  </Button.Root>
                </Dialog.Close>
                <Button.Root className="w-full">
                  <Button.Icon type="leading">
                    <IconSend />
                  </Button.Icon>
                  <Button.Label>
                    <Button.Label>Nhận tư vấn</Button.Label>
                  </Button.Label>
                </Button.Root>
              </Dialog.Actions>
            </form>
          </Form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default AdvisorContactDialog;
