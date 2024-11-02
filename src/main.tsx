import { router } from '@lib/routes';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './index.css';

import { ConfirmDialogProvider } from '@components/ConfirmDialog';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { Toaster } from 'sonner';

const queryClient = new QueryClient();
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ConfirmDialogProvider>
        <RouterProvider router={router} />
      </ConfirmDialogProvider>
      <Toaster richColors position="bottom-left" duration={5000} />
    </QueryClientProvider>
  </React.StrictMode>
);
