import { useBreadcrumb } from '@components/admin-breadcrumb/AdminBreadcrumb';
import MdxPreview from '@components/MdxPreview';
import { Skeleton } from '@components/Skeleton';
import Card from '@components/tailus-ui/Card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@components/tailus-ui/Carosel';
import { Caption, Display, Text } from '@components/tailus-ui/typography';
import { useEffectOnce } from '@hooks/useEffectOnce';
import { SchoolarShip, Study } from '@lib/types';
import { IconImageInPicture } from '@tabler/icons-react';
import _ from 'lodash';
import React from 'react';
import { Await, Link, useLoaderData, useParams } from 'react-router-dom';

function StudyDetails() {
  const { id } = useParams();
  if (!id) throw new Error('id is required');
  const { data, related } = useLoaderData() as {
    data: Study;
    related: [majorRelated: Promise<Study[]>, levelRelated: Promise<Study[]>, continentRelated: Promise<Study[]>];
  };
  const { setItems } = useBreadcrumb();
  useEffectOnce(() => {
    setItems([
      {
        title: 'Du học',
        href: '/du-hoc',
      },
      {
        title: data.name,
        href: `/du-hoc/${data._id}`,
      },
    ]);
  });
  return (
    <div className="grid grid-cols-[1fr_0.3fr] gap-16">
      <section className="space-y-8 py-6">
        <div className="space-y-4">
          <Display size="5xl">{data?.name}</Display>
        </div>
        <div>
          {data.image.length >= 1 ? (
            <Carousel
              opts={{
                align: 'center',
              }}
            >
              <CarouselContent className="max-w-sm">
                {data.image.map((image, i) => (
                  <CarouselItem key={image}>
                    <img key={i} src={image} alt={data.name} className="w-full lg:w-[60vw] h-full object-cover mx-auto rounded-card max-w-[60vw]" />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-3" />
              <CarouselNext className="right-3" />
            </Carousel>
          ) : (
            <Card variant="outlined" className="rounded-card border px-2 py-4 flex items-center justify-center flex-col gap-4 ">
              <IconImageInPicture className="size-12 text-caption opacity-70" />
              <Caption className="">Không có hình ảnh</Caption>
            </Card>
          )}
        </div>
        <div>
          <MdxPreview>{data?.description}</MdxPreview>
        </div>
      </section>
      <section className="sticky top-0 py-3 h-fit space-y-5 bg-soft-bg p-3 min-h-screen">
        <Text className="text-lg font-bold">Có thể bạn quan tâm</Text>
        <div className="space-y-4">
          <React.Suspense
            fallback={
              <>
                <Skeleton className="w-full h-0" />
                <Skeleton className="w-full h-0" />
                <Skeleton className="w-full h-0" />
                <Skeleton className="w-full h-0" />
                <Skeleton className="w-full h-0" />
              </>
            }
          >
            <Await resolve={Promise.all([...related])} errorElement={<p>Error loading package location!</p>}>
              {(packageLocation) => {
                const related = _.uniqBy<Study>(
                  _.flatten<Study>(packageLocation).filter((a) => a._id !== data._id),
                  '_id'
                );

                return related.map((item) => (
                  <Card variant="outlined" className="px-0 py-0" key={item._id}>
                    <Link key={item._id} to={`/du-hoc/${item._id}`}>
                      <img src={item.image[0]} alt={item.name} className="w-full h-40 object-cover rounded-t-md" />
                      <div className="p-3">
                        <Text weight="medium" size="sm">
                          {item.name}
                        </Text>
                        <Caption size="xs">{item.location}</Caption>
                      </div>
                    </Link>
                  </Card>
                ));
              }}
            </Await>
          </React.Suspense>
        </div>
      </section>
    </div>
  );
}

export default StudyDetails;
