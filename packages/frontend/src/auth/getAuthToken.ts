import { AuthenticationResult } from '@azure/msal-browser';
import { MSAL_INSTANCE } from './AuthProvider';
import AuthConfig from './AuthConfig';

/**
 * Returns a new auth token that can be used as a Bearer token for
 * authenticated API calls.
 */
export default async function getAuthToken(): Promise<string | undefined> {
  const allAuthenticatedAccounts = MSAL_INSTANCE.getAllAccounts();
  const account = MSAL_INSTANCE.getAccountByHomeId(
    (allAuthenticatedAccounts[0] || {}).homeAccountId ?? '',
  );

  if (account) {
    const tokenResponse: AuthenticationResult =
      await MSAL_INSTANCE.acquireTokenSilent({
        account,
        scopes: AuthConfig.api.b2cScopes,
      });
    return tokenResponse.accessToken;
  }

  return undefined;
}
