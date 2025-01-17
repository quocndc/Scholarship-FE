import { useGetAdminStatics } from '@components/admin/useGetAdminStatics';
import { Skeleton } from '@components/Skeleton';
import Card from '@components/tailus-ui/Card';
import { Caption, Text, Title } from '@components/tailus-ui/typography';
import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';
import React, { PropsWithChildren, useMemo } from 'react';

function Layout(props: PropsWithChildren) {
  return (
    <Card className="w-full" variant="outlined">
      <Title as="h2" size="lg" weight="medium" className="mb-1">
        Thống kê
      </Title>
      <Text className="my-0" size="sm">
        Xem tổng quan về hệ thống
      </Text>
      <div className="mt-6 grid gap-6 divide-y grid-cols-2 sm:divide-x sm:divide-y-0 md:grid-cols-4">{props.children}</div>
    </Card>
  );
}

function Trend({ trend, value }: { trend: 'up' | 'down'; value: string }) {
  return trend === 'up' ? (
    <div className="flex items-center gap-1.5 [--body-text-color:theme(colors.success.600)] dark:[--body-text-color:theme(colors.success.400)]">
      <IconTrendingUp className="size-4 text-[--body-text-color]" />
      <Text size="sm" className="my-0">
        {value}
      </Text>
    </div>
  ) : (
    <div className="flex items-center gap-1.5 [--body-text-color:theme(colors.danger.600)] dark:[--body-text-color:theme(colors.danger.400)]">
      <IconTrendingDown className="size-4 text-[--body-text-color]" />
      <Text size="sm" className="my-0">
        {value}
      </Text>
    </div>
  );
}

type ItemProps = {
  title: string;
  value: string;
  description?: React.ReactNode;
};
function Item({ title, value, description }: ItemProps) {
  return (
    <div className="pt-6 sm:pl-6 sm:pt-0">
      <Caption as="span">{title}</Caption>

      <div className="mt-2 flex items-center justify-between gap-3">
        <Title as="span">{value}</Title>
        {description}
      </div>
    </div>
  );
}
function StatsList() {
  const { isLoading, data } = useGetAdminStatics();

  const totalTransactionTrend = useMemo<{ trend: 'up' | 'down'; value: string }>(() => {
    if (!data)
      return {
        trend: 'up',
        value: '0',
      };

    const current = data.transactions.thisMonth[0]?.total || 0;
    const last = data.transactions.lastMonth[0].total;
    if (current === 0) {
      return {
        trend: 'down',
        value: '100%',
      };
    }

    const diff = Math.abs(((current - last) / last) * 100);

    return {
      trend: diff > 0 ? 'up' : 'down',
      value: `${diff.toFixed(2)}%`,
    };
  }, [data]);

  if (isLoading)
    return (
      <Layout>
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </Layout>
    );

  return (
    <Layout>
      <Item title="Tổng số hồ sơ" value={data?.resumes.total.toString() ?? '0'} />
      <Item
        title="Tỷ lệ hồ sơ thành công"
        value={`${data?.resumes.completed} / ${data?.resumes.pending}`}
        description={
          <Trend trend={totalTransactionTrend.trend} value={((data!.resumes.pending / data!.resumes.completed!) * 100).toFixed(2) + '%'} />
        }
      />
      <Item title="Tổng số tiền giao dịch" value={data?.transactions.total[0].total.toString() ?? '0'} description={<Caption>VND</Caption>} />
      <Item
        title="Giao dịch tháng này"
        value={data?.transactions.thisMonth[0]?.total?.toString() ?? '0'}
        description={<Trend trend={totalTransactionTrend.trend} value={totalTransactionTrend.value} />}
      />
    </Layout>
  );
}

export default StatsList;
