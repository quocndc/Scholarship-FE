import { useBreadcrumb } from '@components/admin-breadcrumb/AdminBreadcrumb';
import DebounceInput from '@components/DebounceInput';
import ProviderList from '@components/provider-list/ProviderList';
import { Display } from '@components/tailus-ui/typography';
import { useEffectOnce } from '@hooks/useEffectOnce';
import { useSearchParams } from 'react-router-dom';

function NhaCungCapPage() {
  const [search] = useSearchParams();
  const { setItems } = useBreadcrumb();
  const [filter, setFilter] = useSearchParams({
    name: '',
  });

  useEffectOnce(() => {
    setItems([]);
  });

  return (
    <div className="space-y-8 py-6">
      <div className="flex justify-between">
        <div>
          <Display className="text-2xl font-bold">Nhà cung cấp</Display>
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

      <ProviderList search={filter.get('name') ?? ''} />
    </div>
  );
}

export default NhaCungCapPage;
