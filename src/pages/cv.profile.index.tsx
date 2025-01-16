import { useGetUserCv } from '@components/cv-profile/useGetUserCv';
import { TopbarAction } from '@components/data-table';
import DataTable from '@components/data-table/DataTable';
import TopBar from '@components/data-table/Topbar';
import ResumeDetailPanel from '@components/resume-details/ResumeDetailPanel';
import StatusBadge from '@components/resume-details/StatusBadge';
import { UpdateResumePanel, UpdateResumeSchema } from '@components/resume-details/UserUpdateResumePanel';
import { useUpdateResumeStatus } from '@components/resume-details/useUpdateResumeStatus';
import Button from '@components/tailus-ui/Button';
import { Caption, Text } from '@components/tailus-ui/typography';
import { Resume, SchoolarShip } from '@lib/types';
import { IconDownload, IconEdit, IconEye } from '@tabler/icons-react';
import { ColumnDef } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

function CvProfile() {
  const { isLoading, data } = useGetUserCv();
  const [selectedItems, setSelectedItems] = useState<Resume[]>();
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
  const [isUpdateStatusPanelOpen, setIsUpdateStatusPanelOpen] = useState(false);
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
              label: 'Sửa',
              icon: <IconEdit />,
              size: 'sm',
              intent: 'secondary',
              variant: 'soft',
              onClick: () => setIsUpdateStatusPanelOpen(true),
            },
          ]
        : [],
    ],
    [selectedItems?.length]
  );
  const columns = useMemo<ColumnDef<Resume>[]>(
    () => [
      {
        id: 'id',
        header: 'CV',
        accessorFn: (row) => ({
          id: row._id,
          status: row.status,
        }),
        cell: (row) => {
          const { id, status } = row.getValue() as { id: string; status: string };
          return (
            <div className="flex items-center gap-2">
              <StatusBadge status={status} className="flex-shrink-0 min-w-20 text-center" />
              <Text size={'sm'}>{id}</Text>
            </div>
          );
        },
      },
      {
        accessorKey: 'orderCode',
        header: 'Mã đơn hàng',
        cell: (row) => <Caption>{row.getValue() as string}</Caption>,
      },
      {
        accessorKey: 'scholarship',
        header: 'Học bổng',
        cell: (row) => {
          const scholarship = row.getValue() as Pick<SchoolarShip, '_id' | 'name'>;
          return <Caption>{scholarship?.name}</Caption>;
        },
      },
      {
        accessorKey: 'urlCV',
        header: 'CV',
        cell: (row) => {
          const cv = row.getValue() as string;
          return (
            <Button.Root size={'sm'} variant="ghost" href={cv} target="_blank" rel="noreferrer">
              <Button.Icon>
                <IconDownload />
              </Button.Icon>
              <Button.Label>Download</Button.Label>
            </Button.Root>
          );
        },
      },
      {
        accessorKey: 'createdAt',
        header: 'Ngày tạo',
        cell: (row) => <Caption>{new Date(row.getValue() as string).toLocaleDateString()}</Caption>,
      },
    ],
    []
  );
  const onSelect = (ids: string[]) => {
    const item = data?.data ?? [];
    const filtered = item.filter((item) => ids.includes(item._id)) ?? [];
    setSelectedItems(filtered);
  };
  const { mutateAsync } = useUpdateResumeStatus();

  const updateStatus = async (data: UpdateResumeSchema) => {
    toast.promise(mutateAsync(data), {
      loading: 'Đang cập nhật ...',
      success: () => {
        setIsUpdateStatusPanelOpen(false);
        return 'Cập nhật thành công';
      },
      error: 'Cập nhật thất bại',
    });
  };
  return (
    <div>
      <ResumeDetailPanel open={isDetailPanelOpen} onOpenChange={setIsDetailPanelOpen} item={selectedItems?.[0]} />
      <UpdateResumePanel open={isUpdateStatusPanelOpen} onOpenChange={setIsUpdateStatusPanelOpen} item={selectedItems?.[0]} onSubmit={updateStatus} />
      <div className="min-h-12">
        <TopBar selectedItems={selectedItems} actions={actions} totalItems={data?.data.length} />
      </div>
      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        selectionMode="single"
        onSelectionChange={onSelect}
        getRowId={(row) => row._id}
      />
    </div>
  );
}

export default CvProfile;
