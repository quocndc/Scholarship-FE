import { useIsAuthenticated } from '@lib/auth';
import { Navigate, Outlet } from 'react-router-dom';

function NotAuthLayout() {
  const isAuthed = useIsAuthenticated();
  if (isAuthed) {
    return <Navigate to="/user" />;
  }
  return (
    <div className="sm:grid sm:grid-cols-2 lg:grid-cols-3 relative">
      <img src="./images/school_1.jpg" width={6720} height={4480} className="sm:col-span-2 lg:col-span-2 h-screen object-cover blur-sm lg:blur-0" />
      <section className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 lg:relative lg:translate-x-0 lg:translate-y-0 lg:top-0 lg:left-0 flex items-center justify-center px-6 bg-[--ui-bg] border border-[--ui-border-color] py-8 rounded-card">
        <Outlet />
      </section>
    </div>
  );
}

export default NotAuthLayout;
