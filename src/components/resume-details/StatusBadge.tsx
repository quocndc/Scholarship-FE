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
  PAID: 'info',
  PENDING: 'gray',
  REJECTED: 'warning',
  DONE: 'success',
  REVIEWING: 'primary',
};

export default StatusBadge;
