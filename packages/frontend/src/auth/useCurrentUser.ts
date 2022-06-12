import { useMemo } from 'react';
import { ApolloError } from '@apollo/client';
import { useIsAuthenticated } from '@azure/msal-react';
import jwtDecode from 'jwt-decode';
import { useCurrentUser as useCurrUser } from '../hooks/graphQLAPI';
import isFakeAuthEnabled from './isFakeAuthEnabled';

/**
 * A hook which returns information about the current user.
 */
export default function useCurrentUser(): {
  error: ApolloError | undefined;
  isAuthenticated: boolean;
  isLoading: boolean;
  user: { id: string } | undefined;
} {
  const isAzureAuthenticated = useIsAuthenticated();
  const { data: userData, error, loading } = useCurrUser();
  const fakeAuthToken = window.localStorage.getItem('token');

  const isFakeAuthenticated = useMemo(() => {
    if (fakeAuthToken) {
      const decodedToken = jwtDecode<{ exp: number }>(fakeAuthToken);
      const now = new Date();

      // returns true if token hasn't expired yet
      return decodedToken.exp * 1000 > now.getTime();
    }
    return false;
  }, [fakeAuthToken]);

  return {
    error,
    isAuthenticated: isFakeAuthEnabled()
      ? isFakeAuthenticated
      : isAzureAuthenticated,
    isLoading: loading,
    user: userData?.profile,
  };
}
