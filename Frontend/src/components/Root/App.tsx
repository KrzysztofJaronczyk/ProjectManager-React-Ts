import { AuthProvider } from '~/components/contexts/UserContext';
import Main from '~/components/Root/Main';

export const App = () => {
  return (
      <AuthProvider>
        <Main />
      </AuthProvider>
  );
};
