import { Layout } from './components/layout/layout';
import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  redirect,
} from '@tanstack/react-router';
import { queryClient } from '~/lib/queryClient';

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
  beforeLoad: ({ location }) => {
    if (location.pathname === '/apps') {
      redirect({ to: '/', throw: true, viewTransition: true });
    }
  },
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
}).lazy(() =>
  import('./pages/home/public-home-final').then((d) => d.PublicHomeFinalRoute),
);

const blogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/blog',
}).lazy(() =>
  import('./pages/blog/blog-list-page').then((d) => d.BlogListRoute),
);

const routeTree = rootRoute.addChildren([homeRoute, blogRoute]);

export const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  defaultViewTransition: true,
});
