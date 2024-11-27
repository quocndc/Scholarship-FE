import { useBreadcrumb } from '@components/admin-breadcrumb/AdminBreadcrumb';
import { CrawDataTableFilter } from '@components/craw-data/CrawDataFilterPanel';
import { useDeleteCrawData } from '@components/craw-data/useDeleteCrawData';
import { useGetCrawData } from '@components/craw-data/useGetCrawData';
import DataTable from '@components/data-table/DataTable';
import TopBar, { TopbarAction } from '@components/data-table/Topbar';
import { CreateScholarPanel, CreateScholarSchema } from '@components/schoolar-list';
import { type Filter as SchoolarFilter } from '@components/schoolar-list/ScholarshipTableFilter';
import { useCreateScholarShip } from '@components/schoolar-list/useCreateScholarShip';
import { Caption, Link, Text } from '@components/tailus-ui/typography';
import { AdminAvatar } from '@components/user-nav';
import { useEffectOnce } from '@hooks/useEffectOnce';
import { CrawData } from '@lib/types';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { ColumnDef } from '@tanstack/react-table';
import { useCallback, useMemo, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

function AdminCrawler() {
  const { setItems } = useBreadcrumb();
  useEffectOnce(() => {
    setItems([
      {
        title: 'Crawler',
        href: '/admin/crawler',
      },
    ]);
  });
  const [filter, setFilter] = useState<SchoolarFilter>();
  const { isLoading, data, hasNextPage, isFetchingNextPage, fetchNextPage } = useGetCrawData({ filter });
  const { mutateAsync: create } = useCreateScholarShip();
  const { mutateAsync: deleteById } = useDeleteCrawData();

  const columns = useMemo<ColumnDef<CrawData>[]>(
    () => [
      {
        accessorFn: (row) => ({
          id: row._id,
          title: row.title,
          logo: row.logo,
        }),
        header: 'Học bổng',
        cell: (info) => {
          const { title, logo } = info.getValue() as CrawData;
          return (
            <div className="flex gap-2 items-center">
              <AdminAvatar src={logo} size="md" className="flex-shrink-0" />
              <Text size="sm">{title}</Text>
            </div>
          );
        },
      },
      {
        accessorKey: 'href',
        header: 'Link',
        cell: (info) => {
          const link = info.getValue() as CrawData['href'];
          return (
            <Link size="sm" href={link} target="_blank" rel="noreferrer">
              {link}
            </Link>
          );
        },
      },
      {
        accessorKey: 'level',
        header: 'Trình độ',
        cell: (info) => {
          const link = info.getValue() as CrawData['level'];
          return <Text size="sm">{link}</Text>;
        },
      },
      {
        accessorKey: 'location',
        header: 'Location',
        cell: (info) => {
          const link = info.getValue() as CrawData['location'];
          return <Text size="sm">{link}</Text>;
        },
      },
      {
        accessorKey: 'createdAt',
        header: 'Craw lúc',
        cell: (info) => {
          const createdAt = info.getValue() as CrawData['createdAt'];
          return <Caption size="xs">Lúc {Intl.DateTimeFormat('vi-VN').format(new Date(createdAt))}</Caption>;
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

  const [selectedItem, setSelectedItem] = useState<CrawData[]>([]);
  const items = data?.pages?.map((p) => p.data.result).flat() ?? [];

  const onSelect = (ids: string[]) => {
    const filtered = items.filter((item) => ids.includes(item._id)) ?? [];
    setSelectedItem(filtered);
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

  const onDelete = useCallback(() => {
    if (selectedItem.length === 0) {
      return toast.error('Chưa chọn học bổng để xóa');
    }
    toast.promise(deleteById(selectedItem[0]._id), {
      loading: 'Đang xóa học bổng...',
      success: () => {
        setIsDetailPanelOpen(false);
        return 'Xóa học bổng thành công';
      },
      error: 'Xóa học bổng thất bại',
    });
  }, [deleteById, selectedItem]);

  const actions = useMemo<TopbarAction[][]>(() => {
    return [
      [],
      selectedItem.length > 0
        ? [
            {
              label: 'Thêm học bổng này vào danh sách',
              icon: <IconPlus />,
              size: 'sm',
              intent: 'gray',
              variant: 'soft',
              onClick: () => setIsCreatePanelOpen(true),
            },
          ]
        : [],
      selectedItem.length > 0
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
  }, [onDelete, selectedItem.length]);
  return (
    <div className="space-y-2 mt-8">
      <TopBar
        selectedItems={selectedItem}
        actions={actions}
        onFilterClick={() => setIsFilterPanelOpen(true)}
        isFilterActive={isFilterActive}
        totalItems={data?.pages?.[0].data.meta.total}
      />
      <CrawDataTableFilter open={isFilterPanelOpen} onOpenChange={setIsFilterPanelOpen} onSubmit={setFilter} />
      <CreateScholarPanel
        open={isCreatePanelOpen}
        onOpenChange={setIsCreatePanelOpen}
        onSubmit={onCreate}
        defaultValues={{
          name: selectedItem[0]?.title,
          //html to text
          level: (selectedItem[0]?.level ? [selectedItem[0].level] : []) as any,
          location: selectedItem[0]?.location,
          image: selectedItem[0]?.logo ? [selectedItem[0]?.logo] : [],
          description: selectedItem[0]?.description.replace(/<[^>]*>?/gm, ''),
        }}
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

export default AdminCrawler;
