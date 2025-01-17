import { useGetDashboardResume } from '@components/admin/useGetAdminStatics';
import Card from '@components/tailus-ui/Card';
import { Caption, Title } from '@components/tailus-ui/typography';
import { CustomTooltip } from '@components/tailus-ui/visualizations';
import { useMemo } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

function ResumeAreGrid() {
  const { data } = useGetDashboardResume();

  const tranformedData = useMemo(() => {
    if (!data) return [];

    return data
      .sort(
        // sort by year then by month
        (a, b) => a._id.year - b._id.year || a._id.month - b._id.month
      )
      .map((item) => ({
        time: `${item._id.month}/${item._id.year}`,
        total: item.total,
      }));
  }, [data]);

  return (
    <Card variant="outlined" className="space-y-2">
      <div>
        <Title as="h2" size="lg" weight="medium" className="mb-1">
          Hồ sơ
        </Title>
        <Caption>Biểu đồ thống kê hồ sơ theo tháng</Caption>
      </div>
      <div className="h-56 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={tranformedData}>
            <XAxis className="text-caption" dataKey="time" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis className="text-caption" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              cursor={{ stroke: 'var(--ui-border-color)', strokeWidth: 1 }}
              content={<CustomTooltip active payload={[]} mixed label={''} contentAfter={<Caption className="inline ml-2">Hồ sơ</Caption>} />}
            />
            <CartesianGrid horizontal={false} stroke="var(--ui-border-color)" strokeDasharray={3} />

            <Area
              fill="var(--dv-secondary)"
              stroke="var(--dv-secondary)"
              fillOpacity={0.1}
              dataKey="total"
              activeDot={{
                color: 'var(--dv-primary)',
                r: 3,
                stroke: 'white',
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export default ResumeAreGrid;
