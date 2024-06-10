import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from '~/components/contexts/UserContext';
import Main from '~/components/root/Main';
import { ModalContextProvider } from '../contexts/ModalContext';

export const App = () => {
  return (
    <HelmetProvider>
      <ModalContextProvider>
        <AuthProvider>
          <Main />
        </AuthProvider>{' '}
      </ModalContextProvider>
    </HelmetProvider>
  );
};
