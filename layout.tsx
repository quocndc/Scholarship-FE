import LayoutTabs from '@components/profile/LayoutTabs';
import Avatar from '@components/tailus-ui/Avatar';
import { Caption, Title } from '@components/tailus-ui/typography';
import { useIsAuthenticated, useUser } from '@lib/auth';
import { Navigate, Outlet } from 'react-router-dom';

function ProfileLayout() {
  const isAuth = useIsAuthenticated();
  const user = useUser();
  if (!isAuth) return <Navigate to="/login" replace />;
  return (
    <main className="container mx-auto space-y-8">
      <div className="flex gap-2 mb-4">
        <Avatar.Root size="lg">
          <Avatar.Image src={user?.avatar} alt={user?.name} />
          <Avatar.Fallback>{user?.name[0]}</Avatar.Fallback>
        </Avatar.Root>
        <div>
          <Title>{user?.name}</Title>
          <Caption>{user?.email}</Caption>
        </div>
      </div>

      <LayoutTabs className="max-w-sm" />

      <Outlet />
    </main>
  );
}

export default ProfileLayout;
