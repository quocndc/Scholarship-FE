import { useGetSchoolarShip } from '@components/schoolar-list/useSchoolarShip';
import { Skeleton } from '@components/Skeleton';
import Card from '@components/tailus-ui/Card';
import SeparatorRoot from '@components/tailus-ui/Separator';
import { Caption, Text } from '@components/tailus-ui/typography';
import { SchoolarShip } from '@lib/types';
import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import strip from 'remove-markdown';
const Layout = ({ children }: { children: React.ReactNode }) => {
  return <div className="grid grid-cols-2 gap-4">{children}</div>;
};

type SchoolarListProps = {
  filter: Partial<Pick<SchoolarShip, 'name' | 'location'>>;
};
function SchoolarShipsList({ filter }: SchoolarListProps) {
  const { isLoading, data } = useGetSchoolarShip({
    filter,
  });

  const renderItem = useCallback((s: SchoolarShip) => {
    return (
      <Link to={`/hoc-bong/${s._id}`} key={s._id}>
        <Card variant="outlined" className="space-y-2 flex gap-2 hover:bg-soft-bg cursor-pointer transition-[background]">
          <img src={s.image[0]} alt={s.name} className="h-40 rounded-btn aspect-square object-cover" />
          <div className="w-full">
            <Text weight={'bold'} className="line-clamp-2">
              {s.name}
            </Text>
            <Caption>
              {s.createdBy?.email} - {new Date(s.createdAt).toLocaleDateString()}
            </Caption>
            <SeparatorRoot className="mb-4 mt-2 w-full" />
            <Caption className="line-clamp-3">{strip(s.description.slice(0, 100), { useImgAltText: true })}</Caption>
          </div>
        </Card>
      </Link>
    );
  }, []);

  if (isLoading) {
    return (
      <Layout>
        {Array(10)
          .fill(0)
          .map((_, i) => (
            <Card key={i} className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-1/2" />
            </Card>
          ))}
      </Layout>
    );
  }

  if (data?.pages.length === 0) return <div>No data</div>;

  return <Layout>{data?.pages.map((p) => p.data.result.map((s) => renderItem(s)))}</Layout>;
}

export { SchoolarShipsList };
