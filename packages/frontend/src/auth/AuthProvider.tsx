import React from 'react';
import { MsalProvider } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import AuthConfig from './AuthConfig';

export const MSAL_INSTANCE = new PublicClientApplication(
  AuthConfig.azure.client,
);

type Props = {
  children: React.ReactNode;
};

export default function AuthProvider({ children }: Props): JSX.Element {
  return <MsalProvider instance={MSAL_INSTANCE}>{children}</MsalProvider>;
}
