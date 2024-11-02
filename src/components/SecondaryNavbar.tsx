import Button from '@components/tailus-ui/Button';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '@components/tailus-ui/NavigationMenu';
import { Text } from '@components/tailus-ui/typography';
import { UserDropdown } from '@components/user-nav';
import { useIsAuthenticated, useUser } from '@lib/auth';
import { cn } from '@lib/utils';
import { Root as NavigationMenuPrimitiveRoot } from '@radix-ui/react-navigation-menu';
import * as React from 'react';
import { Link } from 'react-router-dom';

export function SecondaryNavbar({ className, ...props }: React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitiveRoot>) {
  const isAuth = useIsAuthenticated();
  const user = useUser();
  return (
    <NavigationMenu {...props} className={cn('flex justify-between w-full px-4 py-2 max-w-none [&>.viewport]:left-48 border-b', className)}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Text>
            Liên hệ: <Link to="tel:0912345678">091 234 5678</Link>
          </Text>
        </NavigationMenuItem>
      </NavigationMenuList>
      {isAuth ? (
        <UserDropdown user={user!} />
      ) : (
        <Button.Root intent="gray" href="/login" size="xs" variant="ghost">
          <Button.Label>Đăng nhập</Button.Label>
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
