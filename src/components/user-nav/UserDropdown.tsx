import Button from '@components/tailus-ui/Button';
import DropdownMenu from '@components/tailus-ui/DropdownMenu';
import { Caption, Title } from '@components/tailus-ui/typography';
import { useAuth } from '@lib/auth';
import { User } from '@lib/types';
import { DropdownMenuProps } from '@radix-ui/react-dropdown-menu';
import { IconHelpCircle, IconLogout2, IconMessageCircleQuestion, IconSettings2, IconUser, IconWallpaper, IconWorld } from '@tabler/icons-react';
import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { AdminAvatar } from './AdminAvatar';

type UserDropdownProps = {
  user: User;
  trigger?: React.ReactNode;
} & DropdownMenuProps;
export const UserDropdown = ({ user, trigger, ...props }: UserDropdownProps) => {
  const logout = useAuth((s) => s.logout);
  const path = useLocation().pathname;
  const handleLogout = () => {
    logout();
    toast.success('Đăng xuất thành công', {
      description: (
        <Button.Root href="/login" variant="outlined" size="xs" intent="info" className="w-full">
          <Button.Label>Đăng nhập lại</Button.Label>
        </Button.Root>
      ),
    });
  };
  const renderAction = useMemo(() => {
    if (!user || typeof user.role === 'string') return null;
    if (path.startsWith('/admin')) {
      return (
        <Button.Root className="bg-soft-bg" variant="outlined" size="xs" intent="gray" href="/">
          <Button.Icon size="xs" type="leading">
            <IconWorld />
          </Button.Icon>
          <Button.Label>Website</Button.Label>
        </Button.Root>
      );
    }
    return (
      user.role.name === 'ADMIN' ||
      (user.role.name === 'SUPER_ADMIN' && (
        <Button.Root className="bg-soft-bg" variant="outlined" size="xs" intent="gray" href="/admin">
          <Button.Icon size="xs" type="leading">
            <IconSettings2 />
          </Button.Icon>
          <Button.Label>Quản lý</Button.Label>
        </Button.Root>
      ))
    );
  }, [path, user]);
  return (
    <DropdownMenu.Root {...props}>
      <DropdownMenu.Trigger asChild={!!trigger}>{trigger ?? <AdminAvatar size="md" />}</DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          side="bottom"
          mixed
          align="end"
          sideOffset={6}
          intent="gray"
          variant="soft"
          className="z-50 dark:[--caption-text-color:theme(colors.gray.400)]"
        >
          <div className="grid gap-3 [grid-template-columns:auto_1fr] p-3">
            <AdminAvatar />
            <div>
              <Title className="text-sm" as="span" weight="medium">
                {user.name}
              </Title>
              <Caption>{user.email}</Caption>

              <div className="mt-4 grid grid-cols-2 gap-3" data-rounded="large">
                {renderAction}
                <Button.Root onClick={handleLogout} className="bg-gray-50" variant="outlined" size="xs" intent="gray">
                  <Button.Icon size="xs" type="leading">
                    <IconLogout2 />
                  </Button.Icon>
                  <Button.Label>Đăng xuất</Button.Label>
                </Button.Root>
              </div>
            </div>
          </div>
          <DropdownMenu.Separator />
          <Link to="/profile">
            <DropdownMenu.Item>
              <DropdownMenu.Icon>
                <IconUser />
              </DropdownMenu.Icon>
              Tài khoản
            </DropdownMenu.Item>
          </Link>
          <Link to="/blog">
            <DropdownMenu.Item>
              <DropdownMenu.Icon>
                <IconWallpaper />
              </DropdownMenu.Icon>
              Bài viết
            </DropdownMenu.Item>
          </Link>
          <Link to="/settings">
            <DropdownMenu.Item>
              <DropdownMenu.Icon>
                <IconSettings2 />
              </DropdownMenu.Icon>
              Cài đặt
            </DropdownMenu.Item>
          </Link>
          <DropdownMenu.Separator />
          <DropdownMenu.Item>
            <DropdownMenu.Icon>
              <IconHelpCircle />
            </DropdownMenu.Icon>
            Hỗ trợ
          </DropdownMenu.Item>
          <DropdownMenu.Item>
            <DropdownMenu.Icon>
              <IconMessageCircleQuestion />
            </DropdownMenu.Icon>
            Phản hồi
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
