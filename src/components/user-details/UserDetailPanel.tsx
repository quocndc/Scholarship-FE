import { Skeleton } from '@components/Skeleton';
import { Sheet, SheetBody, SheetContent, SheetHeader, SheetTitle } from '@components/tailus-ui/Sheet';
import { Table, TableBody, TableCell, TableRow } from '@components/tailus-ui/Table';
import { Caption, Text } from '@components/tailus-ui/typography';
import { useUserDetails } from '@components/user-details/useUserDetails';
import { AdminAvatar } from '@components/user-nav';
import { User } from '@lib/types';
import { type DialogProps } from '@radix-ui/react-dialog';
import { useMemo } from 'react';

type UserDetailPanel = {
  user?: Pick<User, '_id'>;
} & Omit<DialogProps, 'children'>;

function UserDetailsPanel(props: UserDetailPanel) {
  const { user, ...rest } = props;
  const { isLoading, data } = useUserDetails(user?._id ?? '', {
    enabled: !!user && rest.open,
  });
  const table = useMemo(() => {
    if (!data) return [];
    return [
      {
        label: 'Giới tính',
        value: data.gender.toLowerCase() === 'male' ? 'Nam' : 'Nữ',
      },
      {
        label: 'Role',
        value: typeof data.role === 'string' ? data.role : data.role.name,
      },

      {
        label: 'Số điện thoại',
        value: data.phone,
      },
      {
        label: 'Hoạt động',
        value: data.isActive ? 'Đang hoạt động' : 'Không hoạt động',
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
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Chi tiết người dùng</SheetTitle>
        </SheetHeader>
        <SheetBody>
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
              <div className="flex gap-2 items-center">
                <AdminAvatar src={data.avatar} size="lg" />
                <div>
                  <Text weight="bold">{data.name}</Text>
                  <Caption>{data.email}</Caption>
                </div>
              </div>
              <Table className="border-separate border-spacing-y-2">
                <TableBody className="gap-1 space-y-3">
                  {table.map(({ label, value }) => (
                    <TableRow key={label} className="border-none">
                      <TableCell className="bg-soft-bg font-medium text-nowrap">{label}</TableCell>
                      <TableCell className="font-normal">{value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
}

export default UserDetailsPanel;
