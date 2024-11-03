import { FocusCard } from '@components/FocusCard';
import { Navbar } from '@components/MainNavbar';
import { SecondaryNavbar } from '@components/SecondaryNavbar';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@components/tailus-ui/Carosel';
import InfiniteScroll from '@components/tailus-ui/InfiniteScroll';
import { cn } from '@lib/utils';
import { IconAward, IconBriefcase, IconSchool, IconWorld } from '@tabler/icons-react';
import { Display, Text, Title } from '@tailus-ui/typography';
import { useState } from 'react';
import ReactCountryFlag from 'react-country-flag';

function App() {
  return (
    <main>
      <SecondaryNavbar className="" />
      <Navbar className="px-8 min-h-16 border-b shadow-lg" />
      <div className="snap-mandatory snap-y">
        <HeaderSection className="" />
        <StatsSection className="" />
        <AdvisorSection className="" />
        <ConnetSchoolSection className="" />
      </div>
    </main>
  );
}
const headerItems = [
  {
    src: './images/ld/01.png',
    alt: 'Hoc bong du hoc My',
  },
  {
    src: './images/ld/02.jpeg',
    alt: 'Hoc bong du hoc My',
  },
  {
    src: './images/ld/03.jpeg',
    alt: 'Hoc bong du hoc My',
  },
];
function HeaderSection(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <section id="header" {...props}>
      <Carousel
        className="px-2 mx-auto lg:max-w-screen-2xl"
        opts={{
          align: 'center',
          loop: true,
        }}
      >
        <CarouselContent className="h-[25vh] md:h-[40vh] lg:h-[60vh] w-full mx-auto">
          {headerItems.map((i) => (
            <CarouselItem key={i.alt}>
              <img className="w-full h-full object-cover mx-auto" src={i.src} alt={i.alt} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-3" />
        <CarouselNext className="right-3" />
      </Carousel>
    </section>
  );
}

const statsItems = [
  {
    icon: <IconSchool />,
    stats: '900+',
    title: 'Trường đối tác',
  },
  {
    icon: <IconBriefcase />,
    stats: '1200+',
    title: 'Hồ sơ thành công',
  },
  {
    icon: <IconAward />,
    stats: '15+',
    title: 'Năm kinh nghiệm',
  },
  {
    icon: <IconWorld />,
    stats: '12+',
    title: 'Quốc gia du học',
  },
];

function StatsSection(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <section id="header" {...props} className={cn('grid grid-cols-2 md:grid-cols-4 bg-soft-bg divide-x-2')}>
      {statsItems.map((i) => (
        <div
          key={i.title}
          className="flex flex-col items-center justify-center space-y-3 p-4 hover:bg-stone-50 hover:text-accent-500 group cursor-default [&_svg]:size-10 transition-colors"
        >
          {i.icon}
          <Title size="xl" weight="medium" className="group-hover:text-accent-580">
            {i.stats}
          </Title>
          <Text className="group-hover:text-accent-800">{i.title}</Text>
        </div>
      ))}
    </section>
  );
}
const advisorItems = [
  {
    src: './images/ld/usa.jpg',
    alt: 'Hoc bong du hoc My',
    title: 'Du học Mỹ',
    countryCode: 'US',
  },
  {
    src: './images/ld/canada_01.jpg',
    alt: 'Hoc bong du hoc Canada',
    title: 'Du học Canada',
    countryCode: 'CA',
  },
  {
    src: './images/ld/china.jpg',
    alt: 'Hoc bong du hoc Trung Quốc',
    title: 'Du học Trung Quốc',
    countryCode: 'CN',
  },
  {
    src: './images/ld/england.jpg',
    alt: 'Hoc bong du hoc Anh',
    title: 'Du học Anh',
    countryCode: 'GB',
  },
  {
    src: './images/ld/korea.jpg',
    alt: 'Hoc bong du hoc Han Quoc',
    title: 'Du học Hàn Quốc',
    countryCode: 'HK',
  },
  {
    src: './images/ld/brazil.jpg',
    alt: 'Hoc bong du hoc Brazil',
    title: 'Du học Brazil',
    countryCode: 'BR',
  },
];

function AdvisorSection(props: React.HTMLAttributes<HTMLDivElement>) {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <section id="header" {...props} className={cn('mt-8 space-y-4')}>
      <Display size="4xl" className="text-center">
        Du học các nước
      </Display>
      <div className="grid grid-cols-2 md:grid-cols-3 divide-x-2 gap-4 p-5">
        {advisorItems.map((card, index) => (
          <FocusCard key={card.title} card={card} index={index} hovered={hovered} setHovered={setHovered}>
            <div className="flex items-center justify-center gap-4 translate-y-[120px] group-hover:translate-y-0 transition-all duration-300 ease-in">
              <ReactCountryFlag className="!size-8" countryCode={card.countryCode} svg />
              <Text size="xl" className="text-center text-white">
                {card.title}
              </Text>
            </div>
          </FocusCard>
        ))}
      </div>
    </section>
  );
}

const connetSchoolItems = [
  {
    id: 'amity',
    src: './images/ld/amity-u.jpg',
    alt: 'Amity University',
    title: 'Amity University',
  },
  {
    id: 'arizona',
    src: './images/ld/arizona-u.jpg',
    alt: 'Arizona University',
    title: 'Arizona University',
  },
  {
    id: 'trent',
    src: './images/ld/trent-u.png',
    alt: 'Trent University',
    title: 'Trent University',
  },
  {
    id: 'uis',
    src: './images/ld/uis-u.jpg',
    alt: 'University of Illinois at Urbana-Champaign',
    title: 'University of Illinois at Urbana-Champaign',
  },
];

function ConnetSchoolSection(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <section id="header" {...props} className={cn('mt-8 space-y-4')}>
      <Display size="4xl" className="text-center">
        Cộng đồng
      </Display>
      <InfiniteScroll
        items={connetSchoolItems}
        renderItem={(item) => (
          <div>
            <img loading="lazy" src={item.src} alt={item.alt} className="w-full h-full object-cover" />
          </div>
        )}
      />
    </section>
  );
}
export default App;
