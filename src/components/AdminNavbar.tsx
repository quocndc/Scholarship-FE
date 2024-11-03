import Button from '@components/tailus-ui/Button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@components/tailus-ui/NavigationMenu';
import { UserDropdown } from '@components/user-nav';
import { useIsAuthenticated, useUser } from '@lib/auth';
import { cn } from '@lib/utils';
import { Root as NavigationMenuPrimitiveRoot } from '@radix-ui/react-navigation-menu';
import { IconSchool, IconUsers } from '@tabler/icons-react';
import * as React from 'react';
import { Link } from 'react-router-dom';

const adminComponents: { title: string; href: string; description?: string; icon?: React.ReactNode }[] = [
  {
    title: 'Học bổng',
    href: '/admin/scholarship',
    icon: <IconSchool />,
  },
  {
    title: 'Tài khoản',
    href: '/admin/account',
    icon: <IconUsers />,
  },
];
export function AdminNavbar({ className, ...props }: React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitiveRoot>) {
  const isAuth = useIsAuthenticated();
  const user = useUser();

  if (!isAuth) return <div>Not Auth</div>;

  return (
    <NavigationMenu {...props} className={cn('flex justify-between w-full max-w-none [&>.viewport]:left-48', className)}>
      <NavigationMenuList>
        <img className="size-16" src="/images/logo.jpg" alt="Logo" />
        <NavigationMenuItem>
          <Link to="/admin">
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>Trang chủ</NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Quản lý</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {adminComponents.map((component) => (
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

      {isAuth ? (
        <UserDropdown user={user!} />
      ) : (
        <Button.Root intent="secondary" href="/login" size="lg">
          <Button.Label>Đăng ký tư vấn</Button.Label>
        </Button.Root>
      )}
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
