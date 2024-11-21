import { useBreadcrumb } from '@components/admin-breadcrumb/AdminBreadcrumb';
import MdxPreview from '@components/MdxPreview';
import { Skeleton } from '@components/Skeleton';
import Badge from '@components/tailus-ui/Badge';
import Button from '@components/tailus-ui/Button';
import Card from '@components/tailus-ui/Card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@components/tailus-ui/Carosel';
import SeparatorRoot from '@components/tailus-ui/Separator';
import { Caption, Display, Text } from '@components/tailus-ui/typography';
import UploadCVDialog from '@components/upload-cv/UploadCVDialog';
import { useEffectOnce } from '@hooks/useEffectOnce';
import { SchoolarShip } from '@lib/types';
import { IconImageInPicture } from '@tabler/icons-react';
import _ from 'lodash';
import React from 'react';
import { Await, Link, useLoaderData, useParams } from 'react-router-dom';

function SchoolarshipDetails() {
  const { id } = useParams();
  if (!id) throw new Error('id is required');
  const { data, related } = useLoaderData() as {
    data: SchoolarShip;
    related: [majorRelated: Promise<SchoolarShip[]>, levelRelated: Promise<SchoolarShip[]>, continentRelated: Promise<SchoolarShip[]>];
  };
  const { setItems } = useBreadcrumb();
  useEffectOnce(() => {
    setItems([
      {
        title: 'Học bổng',
        href: '/hoc-bong',
      },
      {
        title: data.name,
        href: `/hoc-bong/${data._id}`,
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
                    <img
                      key={image}
                      src={image}
                      alt={data.name}
                      className="w-full lg:w-[60vw] h-full object-cover mx-auto rounded-card max-w-[60vw]"
                    />
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
        <div className="flex flex-wrap gap-2">
          {data.major.map((major) => (
            <Badge key={major} variant="outlined" color="primary">
              #{major}
            </Badge>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {data.level.map((major) => (
            <Badge key={major} variant="outlined" intent="secondary">
              #{major}
            </Badge>
          ))}
        </div>
        <div>
          <MdxPreview>{data?.description}</MdxPreview>
        </div>
      </section>
      <section className="sticky top-0 py-3 h-fit space-y-5 bg-soft-bg p-3 min-h-screen">
        <Text className="text-lg font-bold">Bạn muốn học bổng tại đây?</Text>
        <UploadCVDialog scholarship={data} />
        <SeparatorRoot />
        <Text className="text-lg font-bold">Học bổng liên quan</Text>
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
                const related = _.uniqBy<SchoolarShip>(
                  _.flatten<SchoolarShip>(packageLocation).filter((a) => a._id !== data._id),
                  '_id'
                );

                return related.map((scholarship: SchoolarShip, i) => (
                  <Card variant="outlined" className="px-0 py-0" key={scholarship._id}>
                    <Link key={scholarship._id} to={`/hoc-bong/${scholarship._id}`}>
                      <img src={scholarship.image[0]} alt={scholarship.name} className="w-full h-40 object-cover rounded-t-md" />
                      <div className="p-3">
                        <Text weight="medium" size="sm">
                          {scholarship.name}
                        </Text>
                        <Caption size="xs">
                          {scholarship.location} - {scholarship.level}
                        </Caption>
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

export default SchoolarshipDetails;
