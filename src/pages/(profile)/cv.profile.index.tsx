import { useGetUserCv } from '@components/cv-profile/useGetUserCv';
import { TopbarAction } from '@components/data-table';
import DataTable from '@components/data-table/DataTable';
import TopBar from '@components/data-table/Topbar';
import ResumeDetailPanel from '@components/resume-details/ResumeDetailPanel';
import StatusBadge from '@components/resume-details/StatusBadge';
import { Caption, Text } from '@components/tailus-ui/typography';
import { Resume, SchoolarShip } from '@lib/types';
import { IconEye } from '@tabler/icons-react';
import { ColumnDef } from '@tanstack/react-table';
import { useMemo, useState } from 'react';

function CvProfile() {
  const { isLoading, data } = useGetUserCv();
  const [selectedItems, setSelectedItems] = useState<Resume[]>();
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
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
  return (
    <div>
      <ResumeDetailPanel open={isDetailPanelOpen} onOpenChange={setIsDetailPanelOpen} item={selectedItems?.[0]} />
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
