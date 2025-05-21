import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { DashboardLayout } from 'src/layouts/dashboard';
import { LoadingScreen } from 'src/components/loading-screen';

const ProductListPage = lazy(() => import('src/pages/products/productList'));

const layoutContent = (
  <DashboardLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </DashboardLayout>
);

export const productRoutes = [
  {
    path: 'products',
    element: layoutContent,
    children: [
      { element: <ProductListPage />, index: true },
    ],
  },
];
