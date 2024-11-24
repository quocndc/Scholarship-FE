import { useBreadcrumb } from '@components/admin-breadcrumb/AdminBreadcrumb';
import DataTable from '@components/data-table/DataTable';
import TopBar, { TopbarAction } from '@components/data-table/Topbar';
import { CreateQuizPanel, CreateQuizSchema } from '@components/quiz-list/CreateQuizPanel';
import { QuizDetailPanel } from '@components/quiz-list/QuizDetailPanel';
import { QuizTableFilter } from '@components/quiz-list/QuizTableFilter';
import { useCreateQuiz } from '@components/quiz-list/useCreateQuiz';
import { useDeleteQuiz } from '@components/quiz-list/useDeleteQuiz';
import { useEditQuiz } from '@components/quiz-list/useEditQuiz';
import { useGetQuizzes } from '@components/quiz-list/useGetQuiz';
import Badge from '@components/tailus-ui/Badge';
import { Caption, Text } from '@components/tailus-ui/typography';
import { useEffectOnce } from '@hooks/useEffectOnce';
import { Quiz } from '@lib/types';
import { IconEye, IconPencil, IconPlus, IconTrash } from '@tabler/icons-react';
import { ColumnDef } from '@tanstack/react-table';
import { useCallback, useMemo, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

export default function AdminQuiz() {
  const { setItems } = useBreadcrumb();
  useEffectOnce(() => {
    setItems([
      {
        title: 'Quản lý quiz',
        href: '/admin/quiz',
      },
    ]);
  });
  const [filter, setFilter] = useState<Record<string, any>>();
  const { isLoading, data, hasNextPage, isFetchingNextPage, fetchNextPage } = useGetQuizzes({ filter });
  const { mutateAsync: create } = useCreateQuiz();
  const { mutateAsync: deleteById } = useDeleteQuiz();
  const { mutateAsync: edit } = useEditQuiz();

  const columns = useMemo<ColumnDef<Quiz>[]>(
    () => [
      {
        accessorKey: 'title',
        header: 'Tên quiz',
        cell: (info) => <Text size="sm">{info.getValue() as string}</Text>,
      },
      {
        accessorKey: 'description',
        header: 'Mô tả',
        cell: (info) => <Text size="sm">{info.getValue() as string}</Text>,
      },
      {
        accessorKey: 'type',
        header: 'Loại',
        cell: (info) => <Badge size="sm">{info.getValue() as string}</Badge>,
      },
      {
        accessorFn: (row) => ({
          createdAt: row.createdAt,
        }),
        header: 'Tạo bởi',
        cell: (info) => {
          const data = info.getValue() as { createdAt: string };
          return <Caption size="xs">Lúc {Intl.DateTimeFormat('vi-VN').format(new Date(data.createdAt))}</Caption>;
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

  const [selectedItems, setSelectedItem] = useState<Quiz[]>([]);
  const items = data?.pages?.map((p) => p.data.result).flat() ?? [];

  const onSelect = (ids: string[]) => {
    const filtered = items.filter((item) => ids.includes(item._id)) ?? [];
    setSelectedItem(filtered);
  };

  const onCreate = async (data: CreateQuizSchema, f: UseFormReturn<CreateQuizSchema>) => {
    toast.promise(create(data), {
      loading: 'Đang tạo quiz...',
      success: () => {
        f.reset();
        setIsCreatePanelOpen(false);
        return 'Tạo quiz thành công';
      },
      error: 'Tạo quiz thất bại',
    });
  };

  const onEdit = useCallback(
    async (data: CreateQuizSchema, f: UseFormReturn<CreateQuizSchema>) => {
      if (selectedItems.length === 0) {
        toast.error('Chưa chọn quiz để cập nhật');
      }
      toast.promise(edit(data), {
        loading: 'Đang cập nhật quiz...',
        success: () => {
          f.reset();
          setIsEditPanelOpen(false);
          return 'Cập nhật quiz thành công';
        },
        error: 'Cập nhật quiz thất bại',
      });
    },
    [edit, selectedItems]
  );

  const onDelete = useCallback(() => {
    if (selectedItems.length === 0) {
      return toast.error('Chưa chọn quiz để xóa');
    }
    toast.promise(deleteById(selectedItems[0]._id), {
      loading: 'Đang xóa quiz...',
      success: () => {
        setIsDetailPanelOpen(false);
        return 'Xóa quiz thành công';
      },
      error: 'Xóa quiz thất bại',
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
          href: '/admin/quiz/add',
          // onClick: () => setIsCreatePanelOpen(true),
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
              href: `/admin/quiz/edit/${selectedItems[0]._id}`,
              // onClick: () => setIsEditPanelOpen(true),
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
      <QuizTableFilter open={isFilterPanelOpen} onOpenChange={setIsFilterPanelOpen} onSubmit={setFilter} />
      <QuizDetailPanel open={isDetailPanelOpen} onOpenChange={setIsDetailPanelOpen} item={selectedItems[0]} />
      <CreateQuizPanel open={isCreatePanelOpen} onOpenChange={setIsCreatePanelOpen} onSubmit={onCreate} />
      <CreateQuizPanel open={isEditPanelOpen} onOpenChange={setIsEditPanelOpen} onSubmit={onEdit} defaultValues={selectedItems[0] as any} />
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
