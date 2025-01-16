import CopyButton from '@components/CopyButton';
import StatusBadge from '@components/resume-details/StatusBadge';
import { useGetResumeProvDetails } from '@components/resume-prov-details/useGetResumeDetails';
import { Skeleton } from '@components/Skeleton';
import Button from '@components/tailus-ui/Button';
import { Sheet, SheetBody, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@components/tailus-ui/Sheet';
import { Table, TableBody, TableCell, TableRow } from '@components/tailus-ui/Table';
import { Tooltip } from '@components/tailus-ui/Tooltip';
import { Caption, Link, Text } from '@components/tailus-ui/typography';
import { AdminAvatar } from '@components/user-nav';
import { ResumeProv } from '@lib/types';
import { type DialogProps } from '@radix-ui/react-dialog';
import { IconArrowRight } from '@tabler/icons-react';
import { useMemo } from 'react';

type ResumeDetailPanel = {
  item?: Pick<ResumeProv, '_id'>;
} & Omit<DialogProps, 'children'>;

export function ResumeProvDetailPanel(props: ResumeDetailPanel) {
  const { item, ...rest } = props;
  const { isLoading, data } = useGetResumeProvDetails(item?._id ?? '', {
    enabled: !!item && rest.open,
  });
  const table = useMemo(() => {
    if (!data) return [];
    return [
      {
        label: 'Email',
        value: data.email,
        action: <CopyButton intent="gray" size="xs" variant="soft" content={data.orderCode} />,
      },
      {
        label: 'User id',
        value: data.userId,
        action: <CopyButton intent="gray" size="xs" variant="soft" content={data.orderCode} />,
      },
      {
        label: 'Học bổng',
        value: data.scholarProv.name,
        action: (
          <Tooltip tooltip="Xem chi tiết học bổng">
            <Button.Root size="xs" intent="gray" variant="soft" href={`/nha-cung-cap/${data.provider}/hoc-bong/${data.scholarProv._id}`}>
              <Button.Icon type="only">
                <IconArrowRight />
              </Button.Icon>
            </Button.Root>
          </Tooltip>
        ),
      },

      {
        label: 'CV File',
        value: (
          <Link href={data.urlCV} size={'sm'} target="_blank">
            {data.urlCV.split('/').pop()}
          </Link>
        ),
      },
      {
        label: 'Trạng thái',
        value: <StatusBadge status={data.status} />,
      },
      {
        label: 'Ngày tạo',
        value: Intl.DateTimeFormat('vi-VN').format(new Date(data.createdAt)),
      },
      data.createdBy
        ? {
            label: 'Tạo bởi',
            value: (
              <div className="flex items-center gap-2">
                <AdminAvatar size="sm" />
                <div>
                  <Text size="sm">{data.createdBy?.email}</Text>
                  <Caption size="xs">Lúc {Intl.DateTimeFormat('vi-VN').format(new Date(data.createdAt))}</Caption>
                </div>
              </div>
            ),
          }
        : {},
    ];
  }, [data]);
  return (
    <Sheet {...rest}>
      <SheetContent size="lg" className="flex h-full flex-col gap-4 overflow-auto">
        <SheetHeader className="sticky top-0 z-[51] bg-white border-b py-7">
          <SheetTitle>Chi tiết hồ sơ</SheetTitle>
          <SheetDescription>{item?._id}</SheetDescription>
        </SheetHeader>
        <SheetBody className="flex-1">
          {isLoading && (
            <div className="space-y-4">
              <Skeleton className="w-full h-20 rounded-full" />
              <Skeleton className="w-full h-20" />
              <Skeleton className="w-full h-20" />
              <Skeleton className="w-full h-20" />
              <Skeleton className="w-full h-20" />
            </div>
          )}
          {data && (
            <div className="space-y-8">
              <Table className="border-separate border-spacing-y-2">
                <TableBody className="gap-1 space-y-3">
                  {table.map((item) => {
                    if (!item) return;
                    const { label, value, action } = item;
                    return (
                      <TableRow key={label} className="border-none group [&>td]:py-2 relative">
                        <TableCell className="bg-soft-bg font-medium text-nowrap">{label}</TableCell>
                        <TableCell className="font-normal">{value}</TableCell>
                        {action && <div className="absolute top-1/2 right-0 hidden group-hover:inline-block -translate-y-1/2">{action}</div>}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              <div className="space-y-2">
                <Text weight={'bold'}>Lịch sử</Text>
                <div className="space-y-4">
                  {data.history.map((h, i) => (
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
            </div>
          )}
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
}
