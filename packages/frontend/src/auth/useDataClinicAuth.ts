import { useApolloClient } from '@apollo/client';
import { useCallback, useState } from 'react';
import isFakeAuthEnabled from './isFakeAuthEnabled';
import useAzureLoginLogout from './azure/useAzureLoginLogout';

/**
 * If `REACT_APP_USE_FAKE_AUTH` is set to true, then this function will also
 * handle showing a modal to accept a username and call the `/auth/login`
 * endpoint.
 */
export default function useDataClinicAuth(): {
  isFakeAuthEnabled: boolean;
  isFakeAuthModalOpen: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  onFakeAuthModalDismiss: () => void;
} {
  const apolloClient = useApolloClient();
  const [isFakeAuthModalOpen, setIsFakeAuthModalOpen] = useState(false);
  const { triggerLoginFlow, triggerLogoutFlow } = useAzureLoginLogout();

  const onFakeAuthModalDismiss = useCallback(
    () => setIsFakeAuthModalOpen(false),
    [],
  );

  const login = useCallback(async () => {
    try {
      if (isFakeAuthEnabled()) {
        // for fake auth we just open the auth modal. Refreshing the
        // page after successful login is handled in the FakeAuthModal code.
        setIsFakeAuthModalOpen(true);
      } else {
        await triggerLoginFlow();

        // refresh the page after logging in to make sure all application state
        // gets reset correctly
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
    }
  }, [triggerLoginFlow]);

  const logout = useCallback(async () => {
    try {
      if (isFakeAuthEnabled()) {
        window.localStorage.removeItem('token');
      } else {
        await triggerLogoutFlow();
      }

      // clear any cached state from apollo client
      // NOTE: we intentionally call `clearStore` instead of `resetStore`
      // because `resetStore` will refetch queries (to reflect the new user
      // permissions), which we don't need to do because we call
      // location.reload() right after this which will result in all
      // queries and application state being reset anyways.
      await apolloClient.clearStore();

      // refresh the page after logging in to make sure all application state
      // gets reset correctly
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  }, [triggerLogoutFlow, apolloClient]);

  return {
    isFakeAuthModalOpen,
    login,
    logout,
    onFakeAuthModalDismiss,
    isFakeAuthEnabled: isFakeAuthEnabled(),
  };
}
