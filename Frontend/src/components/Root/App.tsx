import { AuthProvider } from '~/components/contexts/UserContext';
import { ThemeProvider } from '~/components/contexts/ThemeContext';
import Main from '~/components/Root/Main';

export const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Main />
      </ThemeProvider>
    </AuthProvider>
  );
};
