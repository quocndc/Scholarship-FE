import { useBreadcrumb } from '@components/admin-breadcrumb/AdminBreadcrumb';
import { StudyList } from '@components/study-list';
import { Display } from '@components/tailus-ui/typography';
import { useEffectOnce } from '@hooks/useEffectOnce';
import { useSearchParams } from 'react-router-dom';

function DuHocPage() {
  const [search] = useSearchParams();
  const { setItems } = useBreadcrumb();
  useEffectOnce(() => {
    setItems([]);
  });
  return (
    <div className="space-y-8 py-6">
      <div>
        <Display className="text-2xl font-bold">Du học</Display>
        <p className="text-sm text-gray-500">Tìm kiếm {search.get('location') ?? search.get('s')}</p>
      </div>
      <StudyList
        filter={{
          name: search.get('s') || undefined,
          location: search.get('location') || undefined,
        }}
      />
    </div>
  );
}

export default DuHocPage;
