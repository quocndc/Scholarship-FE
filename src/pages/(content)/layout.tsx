import Footer from '@components/Footer';
import MDX from '@components/MDX';
import { Navbar } from '@components/MainNavbar';
import { SecondaryNavbar } from '@components/SecondaryNavbar';
import { AdminBreadcrumb, BreadcrumbProvider } from '@components/admin-breadcrumb/AdminBreadcrumb';
import { Outlet } from 'react-router-dom';
function ContentLayout() {
  return (
    <BreadcrumbProvider>
      <SecondaryNavbar />
      <Navbar className="border-b" />
      <div className="min-h-screen container mx-auto pt-4">
        <MDX>
          <AdminBreadcrumb />
          <Outlet />
        </MDX>
      </div>
      <Footer />
    </BreadcrumbProvider>
  );
}

export default ContentLayout;
