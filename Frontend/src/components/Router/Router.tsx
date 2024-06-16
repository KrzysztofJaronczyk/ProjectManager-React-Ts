import { lazy, Suspense } from 'react';
import { Outlet, RouteObject, BrowserRouter, useRoutes } from 'react-router-dom';

const Loading = () => <p className="p-4 w-full h-full text-center">Loading...</p>;

const IndexScreen = lazy(() => import('~/components/ProjectsList/Index'));
const LoginScreen = lazy(() => import('~/components/Auth/Login'));
const RegisterScreen = lazy(() => import('~/components/Auth/Register'));
const ProjectDetailsScreen = lazy(() => import('~/components/ProjectDetails/ProjectDetails'));
const Page404Screen = lazy(() => import('~/components/404'));

function Layout() {
  return (
    <div>
      <nav className="p-4 flex text-white items-center justify-between bg-slate-800">
        <a href="/" className="text-3xl">
          Project <span className="text-purple-500">Manager</span>
        </a>
      </nav>
      <Outlet />
    </div>
  );
}

export const Router = () => {
  return (
    <BrowserRouter>
      <InnerRouter />
    </BrowserRouter>
  );
};

const InnerRouter = () => {
  const routes: RouteObject[] = [
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          index: true,
          element: <IndexScreen />,
        },
        {
          path: '/login',
          element: <LoginScreen />,
        },
        {
          path: '/register',
          element: <RegisterScreen />,
        },
        {
          path: 'project/:projectId',
          element: <ProjectDetailsScreen />,
        },
        {
          path: '*',
          element: <Page404Screen />,
        },
      ],
    },
  ];
  const element = useRoutes(routes);
  return (
    <div>
      <Suspense fallback={<Loading />}>{element}</Suspense>
    </div>
  );
};