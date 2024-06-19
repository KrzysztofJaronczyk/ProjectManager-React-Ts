import { useAuth } from '~/lib/firebase';

type Props = {};

export const SignOutButton = (props: Props) => {
  const handleClick = () => {
    const auth = useAuth();
    auth.signOut();
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('email');
  };

  return (
    <button onClick={handleClick} type="button" className="btn normal-case">
      Sign Out
    </button>
  );
};
