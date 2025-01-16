import { useBreadcrumb } from '@components/admin-breadcrumb/AdminBreadcrumb';
import Button from '@components/tailus-ui/Button';
import SeparatorRoot from '@components/tailus-ui/Separator';
import { List, Title } from '@components/tailus-ui/typography';
import { useEffectOnce } from '@hooks/useEffectOnce';
import { Provider } from '@lib/types';
import Markdown from 'react-markdown';
import { useLoaderData } from 'react-router-dom';

function ProviderPage() {
  const data = useLoaderData() as Provider;
  const { setItems } = useBreadcrumb();
  useEffectOnce(() => {
    setItems([
      {
        href: '/nha-cung-cap',
        title: 'Nhà cung cấp',
      },
      {
        href: `/nha-cung-cap/${data._id}`,
        title: data.name,
      },
    ]);
  });
  return (
    <div>
      <header style={{ backgroundImage: `url(${data.background})` }} className="bg-center bg-cover bg-no-repeat h-[400px] relative">
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="container mx-auto px-4 py-8 relative z-10 h-full flex flex-col justify-end">
          <div className="flex items-start gap-4">
            <img src={data.logo} alt={data.name} className="w-20 h-20 rounded-full border-4 border-white" />
            <div>
              <h1 className="text-white text-4xl font-bold">{data.name}</h1>
              <Button.Root size="sm" href={`/nha-cung-cap/${data._id}/hoc-bong`} className="mt-4">
                <Button.Label>Xem tất cả học bổng</Button.Label>
              </Button.Root>
            </div>
          </div>
        </div>
      </header>
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="space-y-2">
          <Title>Địa chỉ:</Title>
          <List className="list-disc pl-4 my-0">
            {data.address.map((address) => (
              <li key={address}>{address}</li>
            ))}
          </List>
        </div>
        <SeparatorRoot />
        <div className="space-y-2">
          <Title>Mô tả:</Title>
          <Markdown>{data.description}</Markdown>
        </div>
      </div>
    </div>
  );
}

export default ProviderPage;
