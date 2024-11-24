import { useBreadcrumb } from '@components/admin-breadcrumb/AdminBreadcrumb';
import AdvisoryDetailsPanel from '@components/advisory-details/AdvisoryDetailPanel';
import { AdvisoryUpdateStatusPanel, UpdateAdvisoryStatusSchema } from '@components/advisory-details/AdvisoryUpdateStatusPanel';
import { useUpdateAdvisoryStatus } from '@components/advisory-details/useUpdateAdvisoryStatus';
import { AdvisoryTableFilter, Filter } from '@components/advisory-list/AdvisoryTableFilter';
import StatusBadge from '@components/advisory-list/StatusBadge';
import { useGetAdvisories } from '@components/advisory-list/useGetAdvisories';
import DataTable from '@components/data-table/DataTable';
import TopBar, { TopbarAction } from '@components/data-table/Topbar';
import Badge from '@components/tailus-ui/Badge';
import { Caption, Text } from '@components/tailus-ui/typography';
import { AdminAvatar } from '@components/user-nav';
import { useEffectOnce } from '@hooks/useEffectOnce';
import { Advisory, SchoolarShip } from '@lib/types';
import { IconEye } from '@tabler/icons-react';
import { ColumnDef } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

function AdminAdvisory() {
  const { setItems } = useBreadcrumb();
  useEffectOnce(() => {
    setItems([
      {
        title: 'Quản lý tư vấn',
        href: '/admin/advisory',
      },
    ]);
  });
  const [filter, setFilter] = useState<Filter>();
  const { isLoading, data, hasNextPage, isFetchingNextPage, fetchNextPage } = useGetAdvisories({ filter });
  const { mutateAsync: updateStatus } = useUpdateAdvisoryStatus();

  const columns = useMemo<ColumnDef<Advisory>[]>(
    () => [
      {
        accessorFn: (row) => ({
          email: row.emailAdvisory,
          name: row.fullName,
        }),
        header: 'Hồ sơ',
        cell: (info) => {
          const { name, email } = info.getValue() as Record<string, string>;
          return (
            <div className="">
              <Text size="sm">{name}</Text>
              <Caption size="xs">{email}</Caption>
            </div>
          );
        },
      },
      {
        accessorKey: 'status',
        header: 'Trạng thái',
        cell: (info) => <StatusBadge status={info.getValue() as string} />,
      },
      {
        accessorKey: 'phone',
        header: 'Số điện thoại',
        cell: (info) => <Text size="sm">{info.getValue() as string}</Text>,
      },
      {
        accessorKey: 'address',
        header: 'Địa chỉ',
        cell: (info) => <Text size="sm">{info.getValue() as string}</Text>,
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
        accessorKey: 'level',
        header: 'Trình độ',
        cell: (info) => {
          const subjects = info.getValue() as string;
          return (
            <div className="flex flex-wrap gap-1">
              <Text size="sm">{subjects}</Text>
            </div>
          );
        },
      },
      {
        accessorKey: 'time',
        header: 'Thời gian',
        cell: (info) => {
          const levels = info.getValue() as string;
          return (
            <div className="flex flex-wrap gap-1">
              <Text size="sm">{levels}</Text>
            </div>
          );
        },
      },
      {
        accessorKey: 'createdBy',
        accessorFn: (row) => ({
          createdBy: row.createdBy,
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
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
  const [isUpdateStatusPanelOpen, setIsUpdateStatusPanelOpen] = useState(false);
  const isFilterActive = useMemo(() => {
    if (filter && Object.values(filter).some((v) => v.length > 0)) {
      return true;
    }

    return false;
  }, [filter]);

  const [selectedScholar, setSelectedScholar] = useState<Advisory[]>([]);
  const items = data?.pages?.map((p) => p.data.result).flat() ?? [];

  const onSelect = (ids: string[]) => {
    const filtered = items.filter((item) => ids.includes(item._id)) ?? [];
    setSelectedScholar(filtered);
  };

  const handleUpdateStatus = async (data: UpdateAdvisoryStatusSchema) => {
    toast.promise(updateStatus(data as any), {
      loading: 'Đang cập nhật trạng thái...',
      success: 'Cập nhật trạng thái thành công',
      error: 'Cập nhật trạng thái thất bại',
      finally: () => {
        setIsUpdateStatusPanelOpen(false);
      },
    });
  };

  const actions = useMemo<TopbarAction[][]>(() => {
    return [
      [],
      selectedScholar.length > 0
        ? [
            {
              label: 'Xem chi tiết',
              icon: <IconEye />,
              size: 'sm',
              variant: 'soft',
              onClick: () => setIsDetailPanelOpen(true),
            },
            {
              label: 'Cập nhật trạng thái',
              size: 'sm',
              variant: 'soft',
              intent: 'secondary',
              onClick: () => setIsUpdateStatusPanelOpen(true),
            },
          ]
        : [],
      selectedScholar.length > 0 ? [] : [],
    ];
  }, [selectedScholar.length]);

  return (
    <div className="space-y-2 mt-8">
      <TopBar
        selectedItems={selectedScholar}
        actions={actions}
        onFilterClick={() => setIsFilterPanelOpen(true)}
        isFilterActive={isFilterActive}
        totalItems={data?.pages?.[0].data.meta.total}
      />
      <AdvisoryDetailsPanel item={selectedScholar[0]} open={isDetailPanelOpen} onOpenChange={() => setIsDetailPanelOpen(false)} />
      <AdvisoryTableFilter open={isFilterPanelOpen} onOpenChange={() => setIsFilterPanelOpen(false)} onSubmit={setFilter} />
      <AdvisoryUpdateStatusPanel
        item={selectedScholar[0]}
        open={isUpdateStatusPanelOpen}
        onOpenChange={() => setIsUpdateStatusPanelOpen(false)}
        onSubmit={handleUpdateStatus}
      />
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

export default AdminAdvisory;
