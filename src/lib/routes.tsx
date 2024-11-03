import AdminLayout from '@pages/(admin)/admin.layout';
import AdminResume from '@pages/(admin)/resume.index';
import AdminScholarship from '@pages/(admin)/scholarship.index';
import NotAuthLayout from '@pages/(auth)/auth.layout';
import ForgotPage from '@pages/(auth)/forgot.index';
import LoginPage from '@pages/(auth)/login.index';
import RegisterPage from '@pages/(auth)/register.index';
import PaymentCancelPage from '@pages/(content)/(payment)/cancel.index';
import PaymentSuccessPage from '@pages/(content)/(payment)/success.index';
import HocBongPage from '@pages/(content)/hoc-bong';
import SchoolarshipDetails from '@pages/(content)/hoc-bong/[id].index';
import ContentLayout from '@pages/(content)/layout';
import TuVanPage from '@pages/(content)/tu-van';
import CvProfile from '@pages/(profile)/cv.profile.index';
import ProfileLayout from '@pages/(profile)/layout';
import ProfilePage from '@pages/(profile)/profile.index';
import App from '@pages/index';
import IndexLayout from '@pages/index.layout';
import VerifyPage from '@pages/verify.index';
import { createBrowserRouter, defer } from 'react-router-dom';
import AdminUsers from '../pages/(admin)/users.index';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <IndexLayout />,
    children: [
      {
        index: true,
        element: <App />,
      },
      {
        element: <ContentLayout />,
        children: [
          {
            element: <ProfileLayout />,
            path: '/profile',
            children: [
              {
                element: <ProfilePage />,
                index: true,
              },
              {
                path: '/profile/cv',
                element: <CvProfile />,
              },
            ],
          },
          {
            path: '/tu-van-du-hoc',
            element: <TuVanPage />,
          },
          {
            path: '/hoc-bong',
            children: [
              {
                index: true,
                element: <HocBongPage />,
              },
              {
                path: '/hoc-bong/:id',
                loader: async ({ params }) => {
                  const id = params.id;
                  const { getScholarshipDetails, getRelatedScholarships } = await import('@pages/(content)/hoc-bong/[id].loader');
                  const scholarship = await getScholarshipDetails(id);
                  const { major, level, continent } = scholarship;
                  const majorRelated = getRelatedScholarships({ major });
                  const levelRelated = getRelatedScholarships({ level });
                  const continentRelated = getRelatedScholarships({ continent });

                  return defer({
                    data: scholarship,
                    related: [majorRelated, levelRelated, continentRelated],
                  });
                },
                element: <SchoolarshipDetails />,
              },
            ],
          },
          {
            path: '/payment',
            children: [
              {
                path: '/payment/success',
                element: <PaymentSuccessPage />,
              },
              {
                path: '/payment/cancel',
                element: <PaymentCancelPage />,
              },
            ],
          },
        ],
      },

      {
        element: <NotAuthLayout />,
        children: [
          {
            element: <LoginPage />,
            path: '/login',
          },
          {
            element: <RegisterPage />,
            path: '/register',
          },
          {
            element: <VerifyPage />,
            path: '/verify',
          },
          {
            element: <ForgotPage />,
            path: '/forgot-password',
          },
        ],
      },
      {
        element: <AdminLayout />,
        path: '/admin',
        children: [
          {
            element: <AdminScholarship />,
            path: '/admin/scholarship',
          },
          {
            element: <AdminUsers />,
            path: '/admin/users',
          },
          {
            element: <AdminResume />,
            path: '/admin/resume',
          },
        ],
      },
    ],
  },
]);
