import AdvisorContactDialog from '@components/AdvisorContactDialog';
import Accordion from '@components/tailus-ui/Accordion';
import Button from '@components/tailus-ui/Button';
import Card from '@components/tailus-ui/Card';
import SeparatorRoot from '@components/tailus-ui/Separator';
import { Caption, Display, Text, Title } from '@components/tailus-ui/typography';
import UploadCVProviderForm from '@components/upload-cv/UploadCvProviderForm';
import { SchoolarShip } from '@lib/types';
import { FAQ_DATA, FEATURE_DATA, REVIEW_DATA, STEP_DATA, WHY_DATA } from '@pages/(content)/hoc-bong/constant';
import { IconBulb, IconSparkles, IconStarFilled } from '@tabler/icons-react';
import { useLoaderData, useParams } from 'react-router-dom';
function ApplyScholarship() {
  const providerId = useParams().id;
  const scholarship = useLoaderData() as SchoolarShip;

  return (
    <div>
      <section className={'bg-gradient-to-b from-blue-900 via-blue-800 to to-blue-500 min-h-[60vh] flex items-center justify-center flex-col gap-8'}>
        <div className="flex items-end gap-3 z-10">
          <Display className="text-white" size="6xl" weight={{ initial: 'semibold' }}>
            Nền tảng Tìm Kiếm
          </Display>
          <img src="/images/element01.png" alt="apply-scholarship" className="w-32" height={8} />
        </div>
        <div className="flex items-center gap-3 ml-20 z-10">
          <img src="/images/logo.jpg" alt="apply-scholarship" className="w-32" height={8} />
          <Display className="text-white" size="6xl" weight={{ initial: 'semibold' }}>
            Du học & Học bổng
          </Display>
        </div>
        <span className="relative w-full flex items-center justify-center">
          <Button.Root variant="soft" className="rounded-full font-medium shadow shadow-primary-200 z-10" size="lg" href="#apply-scholarship">
            <Button.Label>NỘP HỒ SƠ NGAY</Button.Label>
          </Button.Root>
          <img
            src="/images/element02.png"
            alt="arrow-down"
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full opacity-20"
          />
        </span>
      </section>
      <section className="py-8 space-y-8 relative overflow-clip">
        <div className="uppercase flex items-center justify-center gap-4 z-10">
          <div className="">
            <Title weight={{ initial: 'bold' }} className="text-primary-800" size="xl">
              Tại sao nên chọn
            </Title>
            <Title weight={{ initial: 'bold' }} className="text-primary-800" size="3xl">
              DU HỌC TẠI SFMS
            </Title>
          </div>
          <Display weight={{ initial: 'bold' }} className="text-primary-800" size="7xl">
            ?
          </Display>
        </div>
        <div className="grid grid-cols-2 gap-4 w-full max-w-screen-xl mx-auto z-10">
          {WHY_DATA.map((item) => (
            <Card className="rounded-full flex items-center gap-4 bg-white" key={item}>
              <div className="bg-primary-800 text-white w-full h-full rounded-full aspect-square flex items-center justify-center max-w-16">
                <IconBulb className="size-10" />
              </div>
              <Text className="text-sm text-pretty">{item}</Text>
            </Card>
          ))}
        </div>
        <img src="/images/element03.png" alt="apply-scholarship" className="-z-10 absolute w-full inset-0 scale-125 -top-32" />
      </section>
      <section
        style={{
          background: 'url(/images/element04.png) no-repeat center center',
        }}
        className=""
      >
        <div className="flex items-center justify-between bg-primary-800 bg-opacity-90 px-5 py-8">
          {FEATURE_DATA.map((item) => (
            <div className="flex items-center flex-col">
              <img src={item.img} alt="feature" className="w-16" />
              <Text className="text-white text-wrap max-w-[20ch] text-center">{item.title}</Text>
            </div>
          ))}
        </div>
      </section>
      <section className="py-8">
        <Display className="text-center text-primary-900 max-w-6xl mx-auto" weight={{ initial: 'normal' }} size="4xl">
          Lộ trình <span className="text-primary-500">đăng ký du học tại SFMS</span> tinh gọn,
          <span>
            <IconSparkles className="inline-block size-16 text-yellow-500" />
          </span>
          <br />
          quy trình xử lý hồ sơ <span className="text-primary-500">nhanh chóng, đơn giản</span>
        </Display>
        <div className="flex items-center justify-between relative">
          {STEP_DATA.map((item, index) => (
            <div className="flex flex-col items-center py-4 z-10" key={item.title}>
              <div className="bg-primary-800 text-white size-20 rounded-full flex items-center justify-center">
                <img src={item.img} alt="step" className="w-10" />
              </div>
              <Text size={'lg'}>Bước {index + 1}</Text>
              <Text className="text-primary-900">{item.title}</Text>
            </div>
          ))}
          <div className="absolute top-[38%] right-12 left-12 -translate-x-1.2 border border-dashed border-primary-200"></div>
        </div>
      </section>
      <section className="bg-primary-800 py-8">
        <div className="w-fit mx-auto space-y-2">
          <Display className="text-center uppercase text-white max-w-6xl mx-auto" weight={{ initial: 'bold' }} size="4xl">
            KHÔNG NGỪNG HOÀN THIỆN vì bạn
          </Display>
          <SeparatorRoot className="bg-orange-500" />
          <Text size="xl" className="text-white">
            Đem đến trải nghiệm đăng ký du học và được tư vấn bởi nhân viên được tối ưu nhất
          </Text>
        </div>
        <div className="flex gap-2 snap-mandatory overflow-x-auto py-8 w-full snap-x px-4">
          {REVIEW_DATA.map((item) => (
            <Card key={item.content} className="min-w-[33%] space-y-2">
              <div className="flex items-center gap-4 snap-center">
                <img src={item.avatar} className="w-16 h-16 rounded-full" alt={item.name} />
                <Caption>{item.content}</Caption>
              </div>
              <SeparatorRoot />
              <div className="flex items-center gap-2 justify-between">
                <div>
                  <Text weight={{ initial: 'bold' }}>{item.name}</Text>
                  <Caption size="xs">{item.university}</Caption>
                </div>
                <div className="flex">
                  <IconStarFilled className="text-yellow-500" />
                  <IconStarFilled className="text-yellow-500" />
                  <IconStarFilled className="text-yellow-500" />
                  <IconStarFilled className="text-yellow-500" />
                  <IconStarFilled className="text-yellow-500" />
                </div>
              </div>
            </Card>
          ))}
        </div>
        <div className="w-fit mx-auto">
          <AdvisorContactDialog />
        </div>
      </section>
      <section className="py-8 px-4 flex">
        <div>
          <Display size="4xl" className="text-primary-800">
            SFMS giúp bạn tháo gỡ thắc mắc
          </Display>
          <img src="/images/element10.png" alt="apply-scholarship" width={812} height={372} />
        </div>
        <div>
          <Accordion.Root type="multiple" className="">
            {FAQ_DATA.map((item) => (
              <Accordion.Item value={item.question} key={FAQ_DATA.indexOf(item)}>
                <Accordion.Trigger>{item.question}</Accordion.Trigger>
                <Accordion.Content>{item.answer}</Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </div>
      </section>
      <section className="bg-primary-800 flex gap-5 py-8 px-4" id="apply-scholarship">
        <img src="/images/element09.png" alt="apply-scholarship" className="flex-shrink-0 aspect-square" />
        <Card fancy className="flex-1 flex flex-col gap-4">
          <UploadCVProviderForm className="h-full flex flex-col justify-between" scholarship={scholarship} providerId={providerId!} />
        </Card>
      </section>
    </div>
  );
}

export default ApplyScholarship;
