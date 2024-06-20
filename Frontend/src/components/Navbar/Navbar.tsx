import { Link, Outlet } from 'react-router-dom';
import { useAuthState, useSignOut } from '../contexts/UserContext';
import { useTheme } from '~/components/contexts/ThemeContext';

const Loading = () => <p className="p-4 w-full h-full text-center">Loading...</p>;

function Navbar() {
  const { state } = useAuthState();
  const { signOut } = useSignOut();
  const { theme } = useTheme();

  if (state.state === 'UNKNOWN') {
    return <Loading />;
  }

  return (
    <div>
      <nav className={`p-4 flex items-center justify-between ${getNavbarClass(theme)}`}>
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

function getNavbarClass(theme: string) {
  switch (theme) {
    case 'dark':
      return 'bg-gray-900 text-white';
    case 'light':
      return 'bg-gray-200 text-gray-900';
    case 'cupcake':
      return 'bg-rose-200 text-rose-900';
    case 'bumblebee':
      return 'bg-yellow-200 text-yellow-900';
    case 'emerald':
      return 'bg-green-200 text-green-900';
    case 'corporate':
      return 'bg-blue-200 text-blue-900';
    case 'synthwave':
      return 'bg-violet-200 text-violet-900';
    case 'retro':
      return 'bg-amber-200 text-amber-900';
    default:
      return 'bg-gray-200 text-gray-900';
  }
}

export default Navbar;
