import { useProviderList } from '@components/provider-list/useProviderList';
import { Skeleton } from '@components/Skeleton';
import Card from '@components/tailus-ui/Card';
import SeparatorRoot from '@components/tailus-ui/Separator';
import { Caption, Text } from '@components/tailus-ui/typography';
import { Provider } from '@lib/types';
import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import strip from 'remove-markdown';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <div className="grid grid-cols-2 gap-4">{children}</div>;
};

type SchoolarListProps = {
  search?: string;
};
function ProviderList({ search }: SchoolarListProps) {
  const { isLoading, data } = useProviderList({
    filter: {
      name: search,
    },
  });

  const renderItem = useCallback((item: Provider) => {
    return (
      <Link to={`/nha-cung-cap/${item._id}`} key={item._id}>
        <Card variant="outlined" className="space-y-2 flex gap-2 hover:bg-soft-bg cursor-pointer transition-[background]">
          <img src={item.logo} alt={item.name} className="h-40 rounded-btn aspect-square object-cover" />
          <div className="w-full">
            <Text weight={'bold'} className="line-clamp-2">
              {item.name}
            </Text>
            <Caption>
              {item.createdBy?.email} - {new Date(item.createdAt).toLocaleDateString()}
            </Caption>
            <SeparatorRoot className="mb-4 mt-2 w-full" />
            <Caption className="line-clamp-3">{strip(item.description.slice(0, 100), { useImgAltText: true })}</Caption>
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

export default ProviderList;
