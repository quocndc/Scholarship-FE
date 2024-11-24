import { useBreadcrumb } from '@components/admin-breadcrumb/AdminBreadcrumb';
import DataTable from '@components/data-table/DataTable';
import TopBar, { TopbarAction } from '@components/data-table/Topbar';
import { CreateScholarPanel, CreateScholarSchema, ScholarDetailPanel } from '@components/schoolar-list';
import { ScholarTableFilter, type Filter as SchoolarFilter } from '@components/schoolar-list/ScholarshipTableFilter';
import { useCreateScholarShip } from '@components/schoolar-list/useCreateScholarShip';
import { useDeleteScholarship } from '@components/schoolar-list/useDeleteScholarship';
import { useEditScholarship } from '@components/schoolar-list/useEditScholarShip';
import { useGetSchoolarShip } from '@components/schoolar-list/useSchoolarShip';
import Badge from '@components/tailus-ui/Badge';
import { Caption, Text } from '@components/tailus-ui/typography';
import { AdminAvatar } from '@components/user-nav';
import { useEffectOnce } from '@hooks/useEffectOnce';
import { SchoolarShip } from '@lib/types';
import { cn } from '@lib/utils';
import { IconEye, IconPencil, IconPlus, IconPointFilled, IconTrash } from '@tabler/icons-react';
import { ColumnDef } from '@tanstack/react-table';
import { useCallback, useMemo, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

function AdminScholarship() {
  const { setItems } = useBreadcrumb();
  useEffectOnce(() => {
    setItems([
      {
        title: 'Quản lý học bổng',
        href: '/admin/scholarship',
      },
    ]);
  });
  const [filter, setFilter] = useState<SchoolarFilter>();
  const { isLoading, data, hasNextPage, isFetchingNextPage, fetchNextPage } = useGetSchoolarShip({ filter });
  const { mutateAsync: create } = useCreateScholarShip();
  const { mutateAsync: deleteById } = useDeleteScholarship();
  const { mutateAsync: edit } = useEditScholarship();

  const columns = useMemo<ColumnDef<SchoolarShip>[]>(
    () => [
      {
        accessorFn: (row) => ({
          name: row.name,
          isActive: row.isActive,
        }),
        header: 'Tên học bổng',
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
        accessorKey: 'major',
        header: 'Chủ đề',
        cell: (info) => {
          const subjects = info.getValue() as string[];
          return (
            <div className="flex flex-wrap gap-1">
              {subjects.map((s, i) => (
                <Badge size="sm" key={i}>
                  {s}
                </Badge>
              ))}
            </div>
          );
        },
      },
      {
        accessorKey: 'level',
        header: 'Cấp',
        cell: (info) => {
          const levels = info.getValue() as string[];
          return (
            <div className="flex flex-wrap gap-1">
              {levels.map((l, i) => (
                <Badge size="sm" key={i}>
                  {l}
                </Badge>
              ))}
            </div>
          );
        },
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

  const [selectedScholar, setSelectedScholar] = useState<SchoolarShip[]>([]);
  const items = data?.pages?.map((p) => p.data.result).flat() ?? [];

  const onSelect = (ids: string[]) => {
    const filtered = items.filter((item) => ids.includes(item._id)) ?? [];
    setSelectedScholar(filtered);
  };

  const onCreate = async (data: CreateScholarSchema, f: UseFormReturn<CreateScholarSchema>) => {
    toast.promise(create(data), {
      loading: 'Đang tạo học bổng...',
      success: () => {
        f.reset();
        setIsCreatePanelOpen(false);
        return 'Tạo học bổng thành công';
      },
      error: 'Tạo học bổng thất bại',
    });
  };

  const onEdit = useCallback(
    async (data: CreateScholarSchema, f: UseFormReturn<CreateScholarSchema>) => {
      if (selectedScholar.length === 0) {
        toast.error('Chưa chọn học bổng để cập nhật');
      }
      toast.promise(
        edit({
          data,
          old: selectedScholar[0],
        }),
        {
          loading: 'Đang cập nhật học bổng...',
          success: () => {
            f.reset();
            setIsEditPanelOpen(false);
            return 'Cập nhật học bổng thành công';
          },
          error: 'Cập nhật học bổng thất bại',
        }
      );
    },
    [edit, selectedScholar]
  );

  const onDelete = useCallback(() => {
    if (selectedScholar.length === 0) {
      return toast.error('Chưa chọn học bổng để xóa');
    }
    toast.promise(deleteById(selectedScholar[0]._id), {
      loading: 'Đang xóa học bổng...',
      success: () => {
        setIsDetailPanelOpen(false);
        return 'Xóa học bổng thành công';
      },
      error: 'Xóa học bổng thất bại',
    });
  }, [deleteById, selectedScholar]);

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
      selectedScholar.length > 0
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
      selectedScholar.length > 0
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
  }, [onDelete, selectedScholar.length]);

  return (
    <div className="space-y-2 mt-8">
      <TopBar
        selectedItems={selectedScholar}
        actions={actions}
        onFilterClick={() => setIsFilterPanelOpen(true)}
        isFilterActive={isFilterActive}
        totalItems={data?.pages?.[0].data.meta.total}
      />
      <ScholarTableFilter open={isFilterPanelOpen} onOpenChange={setIsFilterPanelOpen} onSubmit={setFilter} />
      <ScholarDetailPanel open={isDetailPanelOpen} onOpenChange={setIsDetailPanelOpen} item={selectedScholar[0]} />
      <CreateScholarPanel open={isCreatePanelOpen} onOpenChange={setIsCreatePanelOpen} onSubmit={onCreate} />
      <CreateScholarPanel open={isEditPanelOpen} onOpenChange={setIsEditPanelOpen} onSubmit={onEdit} defaultValues={selectedScholar[0] as any} />
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

export default AdminScholarship;
