import Button from '@components/tailus-ui/Button';
import Card from '@components/tailus-ui/Card';
import { Caption, Title } from '@components/tailus-ui/typography';
import { IconCircleDashedCheck } from '@tabler/icons-react';
import { useSearchParams } from 'react-router-dom';

function PaymentSuccessPage() {
  const [search] = useSearchParams();
  const orderCode = search.get('orderCode');
  return (
    <Card className="flex items-center justify-center flex-col gap-8">
      <IconCircleDashedCheck className="text-green-500 size-44 mx-auto" />
      <div className="space-y-4">
        <Title align="center">Thanh toán thành công</Title>
        <Caption>
          Thanh toán của bạn đã được xác nhận. Mã đơn hàng của bạn là: <strong>{orderCode}</strong>
        </Caption>
        <Button.Root intent="primary" size="lg" href="/">
          <Button.Label>Quay lại trang chủ</Button.Label>
        </Button.Root>
      </div>
    </Card>
  );
}

export default PaymentSuccessPage;
