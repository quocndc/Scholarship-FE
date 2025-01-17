import { useGetProviderDetails } from '@components/provider-list/useGetProviderDetails';
import { Skeleton } from '@components/Skeleton';
import Label from '@components/tailus-ui/Label';
import { Sheet, SheetBody, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@components/tailus-ui/Sheet';
import { Table, TableBody, TableCell, TableRow } from '@components/tailus-ui/Table';
import { Text } from '@components/tailus-ui/typography';
import { AdminAvatar } from '@components/user-nav';
import { Provider } from '@lib/types';
import { type DialogProps } from '@radix-ui/react-dialog';
import { useMemo } from 'react';
import Markdown from 'react-markdown';

type ProviderDetailPanel = {
  item?: Pick<Provider, '_id'>;
} & Omit<DialogProps, 'children'>;

function ProviderDetailPanel(props: ProviderDetailPanel) {
  const { item, ...rest } = props;
  const { isLoading, data } = useGetProviderDetails(item?._id ?? '', {
    enabled: !!item && rest.open,
  });

  const table = useMemo(() => {
    if (!data) return [];
    return [
      {
        label: 'Tên',
        value: data.name,
      },

      {
        label: 'Địa chỉ',
        value: data.address.map((item) => <li key={item}>{item}</li>),
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
                    const { label, value } = item;
                    return (
                      <TableRow key={label} className="border-none group [&>td]:py-2 relative">
                        <TableCell className="bg-soft-bg font-medium text-nowrap">{label}</TableCell>
                        <TableCell className="font-normal">{value}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Logo</Label>
              <img src={data?.logo} alt="logo" className="w-20 h-20 object-cover rounded-lg border" />
            </div>
            <div className="space-y-2">
              <Label>Ảnh nền</Label>
              <img src={data?.background} alt="background" className="w-20 h-20 object-cover rounded-lg border" />
            </div>
            <div className="space-y-2">
              <Label>Mô tả</Label>
              <Markdown>{data?.description}</Markdown>
            </div>
          </div>
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
}

export default ProviderDetailPanel;
