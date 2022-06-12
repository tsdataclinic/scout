import { useCallback } from 'react';
import { useMsal } from '@azure/msal-react';
import { AuthenticationResult } from '@azure/msal-browser';
import AuthConfig from '../AuthConfig';

/**
 * Returns functions to kick off the auth flows for Azure AD B2C's
 * login and logout flows.
 *
 * You shouldn't use this hook directly. Instead, use `useDataClinicAuth`
 * which wraps this hook.
 */
export default function useAzureLoginLogout(): {
  triggerLoginFlow: () => Promise<AuthenticationResult>;
  triggerLogoutFlow: () => Promise<void>;
} {
  const { instance: msalInstance } = useMsal();
  const triggerLoginFlow = useCallback(
    () => msalInstance.loginPopup(AuthConfig.azure.loginRequest),
    [msalInstance],
  );

  const triggerLogoutFlow = useCallback(
    () => msalInstance.logoutPopup(),
    [msalInstance],
  );

  return { triggerLoginFlow, triggerLogoutFlow };
}
