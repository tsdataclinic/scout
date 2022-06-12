import isFakeAuthEnabled from './isFakeAuthEnabled';
import getAzureAuthToken from './azure/getAzureAuthToken';

/**
 * Returns a new auth token that can be used as a Bearer token for
 * API calls that require authentication.
 *
 * This function requires that the user already be authenticated, so
 * you should have done a `login` call already (check out
 * `useLoginLogout.ts`), otherwise it will return undefined.
 *
 * It's recommended that you call `getAuthToken` before every API call
 * so that you can always have an unexpired token available.
 *
 * @returns token string or undefined if the user is not authenticated
 */
export default async function getAuthToken(): Promise<string | undefined> {
  if (isFakeAuthEnabled()) {
    const token = localStorage.getItem('token');
    return token ?? undefined;
  }

  return getAzureAuthToken();
}
