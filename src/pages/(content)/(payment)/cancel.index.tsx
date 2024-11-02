import Button from '@components/tailus-ui/Button';
import Card from '@components/tailus-ui/Card';
import { Caption, Link, Title } from '@components/tailus-ui/typography';
import { IconCircleDashedX } from '@tabler/icons-react';
import { useSearchParams } from 'react-router-dom';
function PaymentCancelPage() {
  const [search] = useSearchParams();

  const message = search.get('code') === '01' && 'Invalid params';

  return (
    <Card className="flex items-center justify-center flex-col gap-8">
      <IconCircleDashedX className="text-danger-500 size-44 mx-auto" />
      <div className="space-y-4">
        <Title align="center">Thanh toán thất bại</Title>
        <Caption>Thanh toán của bạn đã bị hủy.</Caption>
        {message && <Caption>{message}</Caption>}
        <Button.Root intent="primary" size="lg" href="/">
          <Button.Label>Quay lại trang chủ</Button.Label>
        </Button.Root>
        <Link href="/about-us" intent="gray" size="sm">
          Xảy ra lỗi? Liên hệ chúng tôi
        </Link>
      </div>
    </Card>
  );
}

export default PaymentCancelPage;
