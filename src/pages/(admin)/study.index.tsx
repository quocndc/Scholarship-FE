import { useBreadcrumb } from '@components/admin-breadcrumb/AdminBreadcrumb';
import DataTable from '@components/data-table/DataTable';
import TopBar, { TopbarAction } from '@components/data-table/Topbar';
import { CreateStudyPanel, CreateStudySchema, StudyDetailPanel, StudyTableFilter, useGetStudy } from '@components/study-list';
import { useCreateStudy } from '@components/study-list/useCreateStudy';
import { useDeleteStudy } from '@components/study-list/useDeleteStudy';
import { useEditStudy } from '@components/study-list/useEditStudy';
import Badge from '@components/tailus-ui/Badge';
import { Caption, Text } from '@components/tailus-ui/typography';
import { AdminAvatar } from '@components/user-nav';
import { useEffectOnce } from '@hooks/useEffectOnce';
import { SchoolarShip, Study } from '@lib/types';
import { cn } from '@lib/utils';
import { IconEye, IconPencil, IconPlus, IconPointFilled, IconTrash } from '@tabler/icons-react';
import { ColumnDef } from '@tanstack/react-table';
import { useCallback, useMemo, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

function AdminStudy() {
  const { setItems } = useBreadcrumb();
  useEffectOnce(() => {
    setItems([
      {
        title: 'Quản lý du học',
        href: '/admin/study',
      },
    ]);
  });
  const [filter, setFilter] = useState<Record<string, any>>();
  const { isLoading, data, hasNextPage, isFetchingNextPage, fetchNextPage } = useGetStudy({ filter });
  const { mutateAsync: create } = useCreateStudy();
  const { mutateAsync: deleteById } = useDeleteStudy();
  const { mutateAsync: edit } = useEditStudy();

  const columns = useMemo<ColumnDef<Study>[]>(
    () => [
      {
        accessorFn: (row) => ({
          name: row.name,
          isActive: row.isActive,
        }),
        header: 'Tên du học',
        cell: (info) => {
          const { name, isActive } = info.getValue() as { name: string; isActive: boolean };
          return (
            <div className="flex items-center gap-2">
              <IconPointFilled className={cn(isActive ? 'text-green-500' : 'text-red-500', 'shrink-0')} />
              <Text size="sm">{name}</Text>
            </div>
          );
        },
      },
      {
        accessorKey: 'continent',
        header: 'Lục địa',
        cell: (info) => (
          <Badge size="sm" variant={'outlined'} className="text-nowrap">
            {info.getValue() as string}
          </Badge>
        ),
      },

      {
        accessorKey: 'location',
        header: 'Vị trí',
        cell: (info) => (
          <Badge size="sm" variant={'outlined'} className="text-nowrap">
            {info.getValue() as string}
          </Badge>
        ),
      },

      {
        accessorKey: 'createdBy',
        accessorFn: (row) => ({
          ...row.createdBy,
          createdAt: row.createdAt,
        }),
        header: 'Tạo bởi',
        cell: (info) => {
          const user = info.getValue() as SchoolarShip['createdBy'] & { createdAt: string };
          return (
            <div className="flex items-center gap-2">
              <AdminAvatar size="sm" />
              <div className="space-y-1">
                <Text size="sm">{user.email}</Text>
                <Caption size="xs">Lúc {Intl.DateTimeFormat('vi-VN').format(new Date(user.createdAt))}</Caption>
              </div>
            </div>
          );
        },
      },
    ],
    []
  );

  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const isFilterActive = useMemo(() => {
    if (filter && Object.values(filter).some((v) => v.length > 0)) {
      return true;
    }

    return false;
  }, [filter]);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
  const [isCreatePanelOpen, setIsCreatePanelOpen] = useState(false);
  const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);

  const [selectedItems, setSelectedItem] = useState<Study[]>([]);
  const items = data?.pages?.map((p) => p.data.result).flat() ?? [];

  const onSelect = (ids: string[]) => {
    const filtered = items.filter((item) => ids.includes(item._id)) ?? [];
    setSelectedItem(filtered);
  };

  const onCreate = async (data: CreateStudySchema, f: UseFormReturn<CreateStudySchema>) => {
    toast.promise(create(data), {
      loading: 'Đang tạo du học...',
      success: () => {
        f.reset();
        setIsCreatePanelOpen(false);
        return 'Tạo du học thành công';
      },
      error: 'Tạo du học thất bại',
    });
  };

  const onEdit = useCallback(
    async (data: CreateStudySchema, f: UseFormReturn<CreateStudySchema>) => {
      if (selectedItems.length === 0) {
        toast.error('Chưa chọn du học để cập nhật');
      }
      toast.promise(
        edit({
          data,
          old: selectedItems[0],
        }),
        {
          loading: 'Đang cập nhật du học...',
          success: () => {
            f.reset();
            setIsEditPanelOpen(false);
            return 'Cập nhật du học thành công';
          },
          error: 'Cập nhật du học thất bại',
        }
      );
    },
    [edit, selectedItems]
  );

  const onDelete = useCallback(() => {
    if (selectedItems.length === 0) {
      return toast.error('Chưa chọn du học để xóa');
    }
    toast.promise(deleteById(selectedItems[0]._id), {
      loading: 'Đang xóa du học...',
      success: () => {
        setIsDetailPanelOpen(false);
        return 'Xóa du học thành công';
      },
      error: 'Xóa du học thất bại',
    });
  }, [deleteById, selectedItems]);

  const actions = useMemo<TopbarAction[][]>(() => {
    return [
      [
        {
          label: 'Tạo mới',
          icon: <IconPlus />,
          size: 'sm',
          intent: 'gray',
          variant: 'soft',
          onClick: () => setIsCreatePanelOpen(true),
        },
      ],
      selectedItems.length > 0
        ? [
            {
              label: 'Xem chi tiết',
              icon: <IconEye />,
              size: 'sm',
              intent: 'info',
              variant: 'soft',
              onClick: () => setIsDetailPanelOpen(true),
            },
            {
              label: 'Sửa',
              icon: <IconPencil />,
              size: 'sm',
              intent: 'secondary',
              variant: 'soft',
              mode: 'single',
              onClick: () => setIsEditPanelOpen(true),
            },
          ]
        : [],
      selectedItems.length > 0
        ? [
            {
              label: 'Xóa',
              icon: <IconTrash />,
              size: 'sm',
              intent: 'danger',
              variant: 'soft',
              mode: 'single',
              onClick: onDelete,
            },
          ]
        : [],
    ];
  }, [onDelete, selectedItems.length]);

  return (
    <div className="space-y-2 mt-8">
      <TopBar
        selectedItems={selectedItems}
        actions={actions}
        onFilterClick={() => setIsFilterPanelOpen(true)}
        isFilterActive={isFilterActive}
        totalItems={data?.pages?.[0].data.meta.total}
      />
      <StudyTableFilter open={isFilterPanelOpen} onOpenChange={setIsFilterPanelOpen} onSubmit={setFilter} />
      <StudyDetailPanel open={isDetailPanelOpen} onOpenChange={setIsDetailPanelOpen} item={selectedItems[0]} />
      <CreateStudyPanel open={isCreatePanelOpen} onOpenChange={setIsCreatePanelOpen} onSubmit={onCreate} />
      <CreateStudyPanel open={isEditPanelOpen} onOpenChange={setIsEditPanelOpen} onSubmit={onEdit} defaultValues={selectedItems[0] as any} />
      <DataTable
        data={items}
        columns={columns}
        isLoading={isLoading}
        isLoadingMore={isFetchingNextPage}
        onLoadMore={fetchNextPage}
        hasMore={hasNextPage}
        selectionMode="single"
        onSelectionChange={onSelect}
        getRowId={(row) => row._id}
      />
    </div>
  );
}

export default AdminStudy;
