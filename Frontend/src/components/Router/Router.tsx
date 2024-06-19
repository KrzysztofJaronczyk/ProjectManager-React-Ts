import { lazy, Suspense } from 'react';
import { Outlet, RouteObject, BrowserRouter, useRoutes } from 'react-router-dom';
import { useAuthState, useSignOut } from '../contexts/UserContext';
import { Link } from 'react-router-dom';

const Loading = () => <p className="p-4 w-full h-full text-center">Loading...</p>;

const IndexScreen = lazy(() => import('~/components/ProjectsList/Index'));
const LoginScreen = lazy(() => import('~/components/Auth/Login'));
const RegisterScreen = lazy(() => import('~/components/Auth/Register'));
const ProjectDetailsScreen = lazy(() => import('~/components/ProjectDetails/ProjectDetails'));
const Page404Screen = lazy(() => import('~/components/404'));

function Layout() {
  const { state } = useAuthState();
  const { signOut } = useSignOut();

  if (state.state === 'UNKNOWN') {
    return <Loading />;
  }

  return (
    <div>
      <nav className="p-4 flex text-white items-center justify-between bg-slate-800">
        <Link to="/" className="text-3xl">
          Project <span className="text-purple-500">Manager</span>
        </Link>
        <div>
          {state.state === 'SIGNED_IN' ? (
            <>
              <span className="mr-4">Hello, {state.currentUser.email}</span>
              <button onClick={signOut} className="btn normal-case">
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="mr-4">
                Login
              </Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
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
