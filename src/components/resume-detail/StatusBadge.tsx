import Badge from '@components/tailus-ui/Badge';
import { ResumeStatus } from '@lib/types';
import { BadgeProps } from '@tailus/themer';

function StatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <Badge size="xs" className={className} intent={ColorMap[status as keyof typeof ResumeStatus]}>
      {status}
    </Badge>
  );
}

const ColorMap: Record<keyof typeof ResumeStatus, BadgeProps['intent']> = {
  'Chờ kết quả': 'info',
  'Đã thanh toán': 'gray',
  'Sửa hồ sơ': 'warning',
  'Đã hoàn tất': 'success',
  'Giao staff xử lý': 'primary',
  'Hoàn chỉnh hồ sơ': 'accent',
};

export default StatusBadge;
