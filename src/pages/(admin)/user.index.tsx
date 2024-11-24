import { useBreadcrumb } from '@components/admin-breadcrumb/AdminBreadcrumb';
import DataTable from '@components/data-table/DataTable';
import TopBar, { TopbarAction } from '@components/data-table/Topbar';
import { Caption, Text } from '@components/tailus-ui/typography';
import UserDetailsPanel from '@components/user-details/UserDetailPanel';
import { useUserList } from '@components/user-list';
import { useDeleteUser } from '@components/user-list/useDeleteUser';
import { UserFilter, UserTableFilter } from '@components/user-list/UserTableFilter';
import { AdminAvatar } from '@components/user-nav';
import { useEffectOnce } from '@hooks/useEffectOnce';
import { User } from '@lib/types';
import { IconEye, IconGenderFemale, IconGenderMale, IconTrash } from '@tabler/icons-react';
import { ColumnDef } from '@tanstack/react-table';
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';

function AdminUsers() {
  const { setItems } = useBreadcrumb();
  useEffectOnce(() => {
    setItems([
      {
        title: 'Quản lý người dùng',
        href: '/admin/users',
      },
    ]);
  });
  const [filter, setFilter] = useState<UserFilter>();
  const { data, isFetchingNextPage, fetchNextPage, isLoading } = useUserList({
    filter: {
      ...filter,
      populate: 'role',
      fields: ['name', '_id'],
    },
  });

  const { mutateAsync: deleteUser } = useDeleteUser();

  const [selectedItems, setSelectedItems] = useState<User[]>();
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);

  const onSelect = (ids: string[]) => {
    const filtered = items.filter((item) => ids.includes(item._id)) ?? [];
    setSelectedItems(filtered);
  };

  const onDeleteUser = useCallback(
    (id: string) => {
      setSelectedItems(undefined);
      toast.promise(deleteUser(id), {
        loading: 'Đang xóa người dùng...',
        success: 'Xóa người dùng thành công',
        error: 'Xóa người dùng thất bại',
      });
    },
    [deleteUser]
  );

  const actions = useMemo<TopbarAction[][]>(
    () => [
      selectedItems?.length === 1
        ? [
            {
              label: 'Xem chi tiết',
              icon: <IconEye />,
              size: 'sm',
              variant: 'soft',
              onClick: () => setIsDetailPanelOpen(true),
            },
            {
              label: 'Xóa người dùng',
              icon: <IconTrash />,
              size: 'sm',
              intent: 'danger',
              variant: 'soft',
              onClick: () => onDeleteUser(selectedItems?.[0]?._id),
            },
          ]
        : [],
    ],
    [onDeleteUser, selectedItems]
  );

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        id: 'Người dùng',
        accessorFn: (item) => ({ name: item.name, email: item.email, avatar: item.avatar, gender: item.gender }),
        cell: (cell) => {
          const value = cell.getValue() as {
            name: string;
            email: string;
            avatar: string;
            gender: string;
          };

          return (
            <div className="flex gap-2 items-center">
              <AdminAvatar size="sm" src={value.avatar} />
              <div>
                <Text weight={'medium'}>
                  {value.gender.toLowerCase() === 'male' ? (
                    <IconGenderMale className="size-4 inline-block text-sky-500" />
                  ) : (
                    <IconGenderFemale className="size-4 inline-block text-pink-500" />
                  )}
                  {value.name}
                </Text>
                <Caption>{value.email}</Caption>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'role',
        header: 'Vai trò',
        cell: (cell) => {
          const value = cell.getValue() as { name: string };
          return <Text>{value?.name}</Text>;
        },
      },
      {
        accessorKey: 'phone',
        header: 'Số điện thoại',
        cell: (cell) => {
          const value = cell.getValue() as string;
          return <Caption className="text-ellipsis">{value}</Caption>;
        },
      },
      {
        accessorKey: 'address',
        header: 'Địa chỉ',
        cell: (cell) => {
          const value = cell.getValue() as string;
          return <Caption className="text-ellipsis">{value}</Caption>;
        },
      },
      {
        accessorKey: 'age',
        header: 'Tuổi',
      },
    ],
    []
  );

  const items = data?.pages?.map((p) => p.data.result).flat() ?? [];

  const isFilterActive = useMemo(() => {
    if (filter && Object.values(filter).some((v) => v.length > 0)) {
      return true;
    }

    return false;
  }, [filter]);

  return (
    <div className="space-y-2 mt-8">
      <TopBar
        selectedItems={selectedItems}
        actions={actions}
        onFilterClick={() => setIsFilterPanelOpen(true)}
        isFilterActive={isFilterActive}
        totalItems={data?.pages?.[0].data.meta.total}
      />
      <UserTableFilter open={isFilterPanelOpen} onOpenChange={setIsFilterPanelOpen} onSubmit={setFilter} />
      <UserDetailsPanel open={isDetailPanelOpen} onOpenChange={setIsDetailPanelOpen} user={selectedItems?.[0]} />
      <DataTable
        data={items}
        columns={columns}
        isLoading={isLoading}
        isLoadingMore={isFetchingNextPage}
        onLoadMore={fetchNextPage}
        selectionMode="single"
        onSelectionChange={onSelect}
        getRowId={(row) => row._id}
      />
    </div>
  );
}

export default AdminUsers;
