import type { AuthenticationResult } from '@azure/msal-browser';
import { MSAL_INSTANCE } from '../AuthProvider';
import AuthConfig from '../AuthConfig';

const INTERACTION_STATE = {
  interactionInProgress: false,
};

/**
 * Returns a new auth token that can be used as a Bearer token for
 * API calls that require authentication.
 *
 * You shouldn't use this function directly. Instead, use `getAuthToken`
 * which wraps this function.
 *
 * @returns token string or undefined if the user is not authenticated
 */
export default async function getAzureAuthToken(): Promise<string | undefined> {
  const allAuthenticatedAccounts = MSAL_INSTANCE.getAllAccounts();
  const account = MSAL_INSTANCE.getAccountByHomeId(
    (allAuthenticatedAccounts[0] || {}).homeAccountId ?? '',
  );

  if (account) {
    let tokenResponse: AuthenticationResult | undefined;
    try {
      tokenResponse = await MSAL_INSTANCE.acquireTokenSilent({
        account,
        scopes: AuthConfig.azure.api.b2cScopes,
      });
      return tokenResponse.accessToken;
    } catch (_) {
      if (!INTERACTION_STATE.interactionInProgress) {
        INTERACTION_STATE.interactionInProgress = true;

        // our token expired so we ask the user to log in again
        tokenResponse = await MSAL_INSTANCE.acquireTokenPopup({
          scopes: AuthConfig.azure.api.b2cScopes,
        });
        INTERACTION_STATE.interactionInProgress = false;
      } else {
        tokenResponse = undefined;
      }
    }

    return tokenResponse?.accessToken;
  }

  return undefined;
}
