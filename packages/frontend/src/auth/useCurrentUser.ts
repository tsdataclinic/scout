import { ApolloError } from '@apollo/client';
import { useIsAuthenticated } from '@azure/msal-react';
import { useCurrentUser as useCurrUser } from '../hooks/graphQLAPI';

export default function useCurrentUser(): {
  error: ApolloError | undefined;
  isAuthenticated: boolean;
  isLoading: boolean;
  user: { id: string } | undefined;
} {
  const isAuthenticated = useIsAuthenticated();
  const { data: userData, error, loading } = useCurrUser();
  return {
    error,
    isAuthenticated,
    isLoading: loading,
    user: userData?.profile,
  };
}
