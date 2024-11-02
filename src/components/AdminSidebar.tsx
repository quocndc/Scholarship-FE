import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@components/tailus-ui/Collapsible';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@components/tailus-ui/Sidebar';
import { Text } from '@components/tailus-ui/typography';
import { AdminAvatar, UserDropdown } from '@components/user-nav';
import { useUser } from '@lib/auth';
import { User } from '@lib/types';
import { IconChevronRight, IconDatabaseShare, IconFileInvoice, IconSchool, IconUserScan, IconUsersGroup } from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

type SidebarItem = {
  title: string;
  href?: string;
  apiPath?: string;
  icon?: React.ReactNode;
  children?: SidebarItem[];
};

const items: SidebarItem[] = [
  {
    title: 'Trang chủ',
    href: '/admin',
    icon: <IconDatabaseShare />,
  },
  {
    title: 'Quản lý',
    children: [
      {
        title: 'Quản lý học bổng',
        href: '/admin/scholarship',
        icon: <IconSchool />,
        apiPath: '/api/v1/scholarship',
      },
      {
        title: 'Quản lý tài khoản',
        href: '/admin/users',
        icon: <IconUsersGroup />,
        apiPath: '/api/v1/users',
      },
      {
        title: 'Quản lý tư vấn',
        href: '/admin/advisory',
        icon: <IconFileInvoice />,
        apiPath: '/api/v1/advisory',
      },
      {
        title: 'Quản lý CV',
        href: '/admin/resume',
        icon: <IconUserScan />,
        apiPath: '/api/v1/resumes',
      },
    ],
  },
];

const CollapsibleItem = ({ item }: { item: SidebarItem }) => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(true);

  if (item.children) {
    return (
      <Collapsible key={item.title} className="group/collapsable" defaultOpen={true} onOpenChange={(isOpen) => setOpen(isOpen)} open={open}>
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              onClick={() => setOpen(!open)}
              isActive={!open && item.children.some((child) => pathname === child.href)}
              variant="outline"
            >
              {item.icon}
              <span>{item.title}</span>
              <IconChevronRight className="transition-transform ml-auto group-data-[state=open]/collapsable:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <ul className="border-l ml-2">
              {item.children.map((item, i) => (
                <CollapsibleItem item={item} />
              ))}
            </ul>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    );
  }
  return (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton isActive={pathname === item.href} variant="outline" asChild>
        <Link to={item.href ?? '/admin'}>
          {item.icon}
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

function AdminSidebar() {
  const user = useUser() as User;
  const filterItems = useMemo(() => {
    const { permissions } = user;

    return items.map((item) => {
      if (item.children) {
        return {
          ...item,
          children: item.children.filter((child) => permissions.some((p) => p.apiPath === child.apiPath)),
        };
      }
      return item;
    });
  }, [user]);
  return (
    <Sidebar>
      <SidebarHeader className="flex-row items-center gap-2 p-2">
        <div className="flex-1 flex gap-2 items-center">
          <img src="/images/logo.jpg" width={40} height={40} className="rounded-full size-12" />
          <Text weight={'medium'}>{import.meta.env.VITE_APP_TITLE}</Text>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filterItems.map((item, i) => (
                <CollapsibleItem item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t">
        <UserDropdown
          user={user}
          trigger={
            <div className="flex items-center gap-2 p-2 justify-between">
              <AdminAvatar size="lg" />
              <div className="flex-1">
                <Text>{user.name}</Text>
                <Text size="sm">{user.email}</Text>
              </div>
              <IconChevronRight />
            </div>
          }
        />
      </SidebarFooter>
    </Sidebar>
  );
}

export default AdminSidebar;
