// @ts-strict
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Box, Static, Text } from 'ink';
import { useEffect } from 'react';
import { authenticate, ensureIsPrivilegedUser } from './auth/auth';
import { useAuth } from './auth/use-auth';
import { Banner } from './components/ui/Banner';
import { DebugPanel } from './debug/debugger-panel';
import { useAnalytics } from './hooks/use-analytics';
import { AppRouter } from './routes';

const queryClient = new QueryClient();

// refresh the app every 100ms
const useKeepAlive = () =>
  useEffect(() => {
    setInterval(() => {}, 100);
  }, []);

export const App = () => {
  useKeepAlive();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthWrapper>
        <Box display="flex" width="100%">
          <Box flexGrow={1} flexDirection="column">
            <AppRouter />
          </Box>
          <DebugPanel />
        </Box>
      </AuthWrapper>
    </QueryClientProvider>
  );
};

function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { data, error, isLoading } = useAuth();
  const { trackEvent } = useAnalytics();
  const isAuthenticated = !isLoading && !!data?.isLoggedIn;

  useEffect(() => {
    if (!isAuthenticated) {
      void authenticate();
    } else {
      // ensure the user is a neon employee
      void ensureIsPrivilegedUser();

      // track identify event when user is authenticated
      trackEvent({
        eventType: 'identify',
      });
    }
  }, [isAuthenticated, trackEvent]);

  let content = null;

  if (error) {
    content = <Text color="red">Error: {error.message}</Text>;
  } else if (!data?.isLoggedIn) {
    content = null;
  } else {
    content = children;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Box flexDirection="column" gap={1}>
      <Static items={['banner']}>
        {() => (
          <Banner key="banner" title="Welcome to app.build CLI">
            Create, deploy, and manage your applications with ease
          </Banner>
        )}
      </Static>
      {content}
    </Box>
  );
}
