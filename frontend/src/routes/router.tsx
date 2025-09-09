import {
  createRouter,
  createRoute,
  createRootRoute,
} from '@tanstack/react-router';
import { Outlet, lazyRouteComponent } from '@tanstack/react-router';
import AppLayout from '../components/layout/AppLayout';

// ルートレイアウト
const rootRoute = createRootRoute({
  component: () => (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ),
});

// ホームページ
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: lazyRouteComponent(() => import('../pages/dashboard/DashboardPage')),
});

// ログインページ
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: () => <div>Login Page</div>,
});

// ユーザー管理
const usersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/users',
  component: () => <div>Users Page</div>,
});

// 在庫管理
const stocksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/stocks',
  component: lazyRouteComponent(() => import('../pages/stock/StocksPage')),
});

// 顧客管理
const customersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/customers',
  component: lazyRouteComponent(() => import('../pages/customer/CustomersPage')),
});

// 注文管理
const ordersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/orders',
  component: () => <div>Orders Page</div>,
});

// 販売管理
const salesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sales',
  component: lazyRouteComponent(() => import('../pages/sales/OrdersPage')),
});

// プロファイル
const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: lazyRouteComponent(() => import('../pages/profile/ProfilePage')),
});

// ルートツリーの作成
const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  usersRoute,
  stocksRoute,
  customersRoute,
  ordersRoute,
  salesRoute,
  profileRoute,
]);

// ルーターの作成
export const router = createRouter({ routeTree });

// 型安全性のための宣言
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
