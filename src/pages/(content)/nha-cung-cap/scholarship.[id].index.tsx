import { useBreadcrumb } from '@components/admin-breadcrumb/AdminBreadcrumb';
import DebounceInput from '@components/DebounceInput';
import { SchoolarProvList } from '@components/schoolarprov-list/ScholarProvList';
import { Display } from '@components/tailus-ui/typography';
import { useEffectOnce } from '@hooks/useEffectOnce';
import { Provider } from '@lib/types';
import { useLoaderData, useParams, useSearchParams } from 'react-router-dom';

function HongBongNhaCungCapPage() {
  const { id } = useParams();
  const data = useLoaderData() as Provider;
  const [search] = useSearchParams();
  const { setItems } = useBreadcrumb();
  const [filter, setFilter] = useSearchParams({
    name: '',
  });

  useEffectOnce(() => {
    setItems([
      {
        title: 'Nhà cung cấp',
        href: '/nha-cung-cap',
      },
      {
        title: data?.name,
        href: `/nha-cung-cap/${id}`,
      },
      {
        title: 'Học bổng',
        href: `/nha-cung-cap/${id}/scholarship`,
      },
    ]);
  });

  return (
    <div className="space-y-8 py-6">
      <div className="flex justify-between">
        <div>
          <Display className="text-2xl font-bold">Học bổng {data.name}</Display>
          <p className="text-sm text-gray-500">Tìm kiếm {search.get('name')}</p>
        </div>
        <DebounceInput
          className="max-w-[250px]"
          placeholder="Tìm kiếm"
          defaultValue={search.get('name') ?? ''}
          onChange={(e) => {
            setFilter({
              name: e,
            });
          }}
        />
      </div>

      <SchoolarProvList filter={{ name: search.get('name') || '' }} providerId={data._id} />
    </div>
  );
}

export default HongBongNhaCungCapPage;
