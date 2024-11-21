import { useBreadcrumb } from '@components/admin-breadcrumb/AdminBreadcrumb';
import { SchoolarShipsList } from '@components/schoolar-list';
import { Display } from '@components/tailus-ui/typography';
import { useEffectOnce } from '@hooks/useEffectOnce';
import { useSearchParams } from 'react-router-dom';

function HocBongPage() {
  const [search] = useSearchParams();
  const { setItems } = useBreadcrumb();
  useEffectOnce(() => {
    setItems([]);
  });
  return (
    <div className="space-y-8 py-6">
      <div>
        <Display className="text-2xl font-bold">Học bổng</Display>
        <p className="text-sm text-gray-500">Tìm kiếm {search.get('location') ?? search.get('s')}</p>
      </div>
      <SchoolarShipsList
        filter={{
          name: search.get('s') || undefined,
          location: search.get('location') || undefined,
        }}
      />
    </div>
  );
}

export default HocBongPage;
