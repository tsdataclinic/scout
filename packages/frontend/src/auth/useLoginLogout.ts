import { useMsal } from '@azure/msal-react';
import { AuthenticationResult } from '@azure/msal-browser';
import { useApolloClient } from '@apollo/client';
import AuthConfig from './AuthConfig';

/**
 * Returns functions to kick off the auth flows for Azure AD B2C's
 * login and logout flows.
 */
export default function useLoginLogout(): {
  login: () => Promise<AuthenticationResult>;
  logout: () => Promise<void>;
} {
  const { instance: msalInstance } = useMsal();
  const apolloClient = useApolloClient();

  return {
    login: () => msalInstance.loginPopup(AuthConfig.loginRequest),
    logout: async () => {
      await msalInstance.logoutPopup();
      await apolloClient.resetStore();
    },
  };
}
