import MdxPreview from '@components/MdxPreview';
import Card from '@components/tailus-ui/Card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@components/tailus-ui/Carosel';
import { Sheet, SheetBody, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@components/tailus-ui/Sheet';
import { Table, TableBody, TableCell, TableRow } from '@components/tailus-ui/Table';
import { Caption, Text } from '@components/tailus-ui/typography';
import { SchoolarShip } from '@lib/types';
import { DialogProps } from '@radix-ui/react-dialog';
import { IconImageInPicture } from '@tabler/icons-react';
import { DialogProps as VariantProps } from '@tailus/themer';
import { useMemo } from 'react';
type ScholarDetailPaneProps = Omit<DialogProps, 'children'> & {
  item?: SchoolarShip;
} & VariantProps;

type TableItem = {
  label: string;
  value: React.ReactNode;
};

function ScholarDetailPanel(props: ScholarDetailPaneProps) {
  const { item, ...rest } = props;

  const table = useMemo<TableItem[]>(() => {
    if (!item) return [];
    return [
      {
        label: 'Tên học bổng',
        value: item.name,
      },
      {
        label: 'Loại học bổng',
        value: item.location,
      },
      {
        label: 'Vị trí',
        value: item.continent,
      },
      {
        label: 'Số lượng',
        value: item.quantity,
      },
      {
        label: 'Chủ đề',
        value: item.major.join(', '),
      },
      {
        label: 'Cấp',
        value: item.level.join(', '),
      },
      {
        label: 'Trạng thái',
        value: item.isActive ? 'Hoạt động' : 'Không hoạt động',
      },
      {
        label: 'Ngày tạo',
        value: Intl.DateTimeFormat('vi-VN').format(new Date(item.createdAt)),
      },
      {
        label: 'Ngày cập nhật',
        value: item.updatedAt ? Intl.DateTimeFormat('vi-VN').format(new Date(item.updatedAt)) : 'Chưa cập nhật',
      },
      {
        label: 'Tạo bởi',
        value: item.createdBy.email,
      },
    ];
  }, [item]);

  if (!item) return null;

  return (
    <Sheet {...rest}>
      <SheetContent size="3xl" className="flex h-full flex-col gap-4 overflow-auto">
        <SheetHeader className="sticky top-0 z-[51] bg-white border-b py-7">
          <SheetTitle>Thông tin học bổng</SheetTitle>
          <SheetDescription>{item._id}</SheetDescription>
        </SheetHeader>
        <SheetBody className="flex-1 space-y-8">
          <Table className="border-separate border-spacing-y-2">
            <TableBody className="gap-1 space-y-3">
              {table.map(({ label, value }) => (
                <TableRow key={label} className="border-none">
                  <TableCell className="bg-soft-bg font-medium text-nowrap">{label}</TableCell>
                  <TableCell className="font-normal">{value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div>
            <Text weight="semibold">Hình ảnh</Text>
            {item.image.length >= 1 ? (
              <Carousel
                opts={{
                  align: 'start',
                }}
              >
                <CarouselContent>
                  {item.image.map((image, i) => (
                    <CarouselItem key={image}>
                      <img key={i} src={image} alt={item.name} className="w-full h-full object-cover mx-auto" />
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
          <div className="h-max py-2">
            <Text weight="semibold">Mô tả</Text>
            <Card variant="outlined">
              <MdxPreview>{item.description}</MdxPreview>
            </Card>
          </div>
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
}

export { ScholarDetailPanel };
