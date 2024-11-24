import { useBreadcrumb } from '@components/admin-breadcrumb/AdminBreadcrumb';
import DataTable from '@components/data-table/DataTable';
import TopBar, { TopbarAction } from '@components/data-table/Topbar';
import { CreateQuestionPanel, CreateQuestionSchema, QuestionDetailPanel, QuestionTableFilter, useGetQuestion } from '@components/question-list';
import { useCreateQuestion } from '@components/question-list/useCreateQuestion';
import { useDeleteQuestion } from '@components/question-list/useDeleteQuestion';
import { useEditQuestion } from '@components/question-list/useEditQuestion';
import { Caption, Text } from '@components/tailus-ui/typography';
import { AdminAvatar } from '@components/user-nav';
import { useEffectOnce } from '@hooks/useEffectOnce';
import { Question, SchoolarShip } from '@lib/types';
import { cn } from '@lib/utils';
import { IconEye, IconPencil, IconPlus, IconPointFilled, IconTrash } from '@tabler/icons-react';
import { ColumnDef } from '@tanstack/react-table';
import { useCallback, useMemo, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

export default function AdminQuestion() {
  const { setItems } = useBreadcrumb();
  useEffectOnce(() => {
    setItems([
      {
        title: 'Quản lý câu hỏi',
        href: '/admin/question',
      },
    ]);
  });
  const [filter, setFilter] = useState<Record<string, any>>();
  const { isLoading, data, hasNextPage, isFetchingNextPage, fetchNextPage } = useGetQuestion({ filter });
  const { mutateAsync: create } = useCreateQuestion();
  const { mutateAsync: deleteById } = useDeleteQuestion();
  const { mutateAsync: edit } = useEditQuestion();

  const columns = useMemo<ColumnDef<Question>[]>(
    () => [
      {
        accessorFn: (row) => ({
          name: row.question,
          isActive: row.question,
        }),
        header: 'Câu hỏi',
        cell: (info) => {
          const { name, isActive } = info.getValue() as { name: string; isActive: boolean };
          return (
            <div className="flex items-center gap-2">
              <IconPointFilled className={cn(isActive ? 'text-green-500' : 'text-red-500', 'shrink-0')} />
              <Text size="sm" className="text-ellipsis line-clamp-1">
                {name}
              </Text>
            </div>
          );
        },
      },
      {
        accessorKey: 'answer',
        header: 'Câu trả lời',
        cell: (info) => <Text size="sm">{info.getValue() as string}</Text>,
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

  const [selectedItems, setSelectedItem] = useState<Question[]>([]);
  const items = data?.pages?.map((p) => p.data.result).flat() ?? [];

  const onSelect = (ids: string[]) => {
    const filtered = items.filter((item) => ids.includes(item._id)) ?? [];
    setSelectedItem(filtered);
  };

  const onCreate = async (data: CreateQuestionSchema, f: UseFormReturn<CreateQuestionSchema>) => {
    toast.promise(create(data), {
      loading: 'Đang tạo câu hỏi...',
      success: () => {
        f.reset();
        setIsCreatePanelOpen(false);
        return 'Tạo câu hỏi thành công';
      },
      error: 'Tạo câu hỏi thất bại',
    });
  };

  const onEdit = useCallback(
    async (data: CreateQuestionSchema, f: UseFormReturn<CreateQuestionSchema>) => {
      if (selectedItems.length === 0) {
        toast.error('Chưa chọn câu hỏi để cập nhật');
      }
      toast.promise(edit(data), {
        loading: 'Đang cập nhật câu hỏi...',
        success: () => {
          f.reset();
          setIsEditPanelOpen(false);
          return 'Cập nhật câu hỏi thành công';
        },
        error: 'Cập nhật câu hỏi thất bại',
      });
    },
    [edit, selectedItems]
  );

  const onDelete = useCallback(() => {
    if (selectedItems.length === 0) {
      return toast.error('Chưa chọn câu hỏi để xóa');
    }
    toast.promise(deleteById(selectedItems[0]._id), {
      loading: 'Đang xóa câu hỏi...',
      success: () => {
        setIsDetailPanelOpen(false);
        return 'Xóa câu hỏi thành công';
      },
      error: 'Xóa câu hỏi thất bại',
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
      <QuestionTableFilter open={isFilterPanelOpen} onOpenChange={setIsFilterPanelOpen} onSubmit={setFilter} />
      <QuestionDetailPanel open={isDetailPanelOpen} onOpenChange={setIsDetailPanelOpen} item={selectedItems[0]} />
      <CreateQuestionPanel open={isCreatePanelOpen} onOpenChange={setIsCreatePanelOpen} onSubmit={onCreate} />
      <CreateQuestionPanel open={isEditPanelOpen} onOpenChange={setIsEditPanelOpen} onSubmit={onEdit} defaultValues={selectedItems[0] as any} />
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
