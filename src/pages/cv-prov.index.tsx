import { useGetUserCvProv } from '@components/cv-profile/useGetUserCv';
import { TopbarAction } from '@components/data-table';
import DataTable from '@components/data-table/DataTable';
import TopBar from '@components/data-table/Topbar';
import StatusBadge from '@components/resume-details/StatusBadge';
import { ResumeProvDetailPanel } from '@components/resume-prov-details/ResumeProvDetails';
import Button from '@components/tailus-ui/Button';
import { Caption, Text } from '@components/tailus-ui/typography';
import { ResumeProv, SchoolarShip } from '@lib/types';
import { IconDownload, IconEye } from '@tabler/icons-react';
import { ColumnDef } from '@tanstack/react-table';
import { useMemo, useState } from 'react';

function CvProvProfile() {
  const { isLoading, data } = useGetUserCvProv();
  const [selectedItems, setSelectedItems] = useState<ResumeProv[]>();
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
  const columns = useMemo<ColumnDef<ResumeProv>[]>(
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
        accessorKey: 'scholarProv',
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

  return (
    <div>
      <ResumeProvDetailPanel open={isDetailPanelOpen} onOpenChange={setIsDetailPanelOpen} item={selectedItems?.[0]} />
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

export default CvProvProfile;
