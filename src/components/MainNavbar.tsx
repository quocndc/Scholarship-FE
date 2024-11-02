import AdvisorContactDialog from '@components/AdvisorContactDialog';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@components/tailus-ui/NavigationMenu';
import { Text } from '@components/tailus-ui/typography';
import axios from '@lib/axios';
import { IResponse } from '@lib/types';
import { cn } from '@lib/utils';
import { Root as NavigationMenuPrimitiveRoot } from '@radix-ui/react-navigation-menu';
import { useQuery } from '@tanstack/react-query';
import * as React from 'react';
import { Link } from 'react-router-dom';

const components: { title: string; href: string; description: string }[] = [
  {
    title: 'Học bổng',
    href: '/tu-van-du-hoc',
    description: 'Chương trình học bổng và lựa chọn phù hợp',
  },
  {
    title: 'Du học',
    href: '/tu-van-du-hoc',
    description: 'Chương trình du học các nước',
  },
  {
    title: 'Điều kiện du học',
    href: '/tu-van-du-hoc',
    description: 'Điều kiện được phép đi du học',
  },
  {
    title: 'FAQ',
    href: '/tu-van-du-hoc',
    description: 'Những câu hỏi thường gặp trong học bổng',
  },
];

function useGetListLocation() {
  return useQuery({
    queryKey: ['listLocation'],
    queryFn: async () => {
      return axios.get<IResponse<Record<string, string[]>>>('/scholarship/list-location').then((res) => res.data.data);
    },
  });
}

export function Navbar({ className, ...props }: React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitiveRoot>) {
  const { isLoading, data } = useGetListLocation();
  return (
    <NavigationMenu {...props} className={cn('flex justify-between w-full max-w-none [&>.viewport]:left-48', className)}>
      <NavigationMenuList>
        <img className="size-16" src="/images/logo.jpg" alt="Logo" />
        <NavigationMenuItem>
          <Link to="/">
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>Trang chủ</NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Du học</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 lg:w-[80vw] w-[50vw] w lg:grid-cols-[.75fr_1fr_1fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <Link
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-white to-soft-bg p-6 no-underline outline-none focus:shadow-md "
                    to="/"
                  >
                    {/* <Icons.logo className="h-6 w-6" /> */}
                    <div className="mb-2 mt-4 text-lg font-medium">SFMS</div>
                    <p className="text-sm leading-tight text-muted-foreground">Học bổng chất lượng - Tự do phát triển</p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <div>
                <Text weight={'bold'}>Du học Úc</Text>
                <ListItem href="/about-us" title="Du học Úc" />
                <ListItem href="/about-us" title="Du học New Zealand" />
              </div>
              <div>
                <Text weight={'bold'}>Du học Châu Mỹ</Text>
                <ListItem href="/about-us" title="Du học Mỹ" />
                <ListItem href="/about-us" title="Du học Canada" />
              </div>
              <div>
                <Text weight={'bold'}>Du học Châu Á</Text>
                <ListItem href="/about-us" title="Du học Trung Quốc" />
                <ListItem href="/about-us" title="Du học Hàn Quốc" />
                <ListItem href="/about-us" title="Du học Singapore" />
                <ListItem href="/about-us" title="Du học Philippines" />
              </div>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Học bổng</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 w-[50vw] lg:grid-cols-[.75fr_1fr_1fr]">
              {isLoading && (
                <li>
                  <Text>Loading...</Text>
                </li>
              )}
              {data &&
                Object.entries(data ?? {}).map(([continent, countries]) => (
                  <div key={continent}>
                    <Text weight={'bold'}>{continent}</Text>
                    {countries.map((country) => (
                      <ListItem key={country} title={country} href={`/hoc-bong?location=${country}`} />
                    ))}
                  </div>
                ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Tư vấn</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {components.map((component) => (
                <ListItem key={component.title} title={component.title} href={component.href}>
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/about-us">
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>Liên hệ</NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
      <AdvisorContactDialog />
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<React.ElementRef<'a'>, React.ComponentPropsWithoutRef<'a'>>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-btn p-3 leading-none no-underline outline-none transition-colors hover:bg-[--ui-soft-bg] hover:text-display focus:bg-[--ui-soft-bg] focus:text-display h-full',
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-caption">{children}</p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';
