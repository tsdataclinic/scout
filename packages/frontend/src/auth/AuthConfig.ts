import { Configuration } from '@azure/msal-browser';

type AzureAuthConfig = {
  client: Configuration;
  api: {
    // scopes needed to access the app's API
    b2cScopes: string[];
  };

  // scopes to be granted at login. Additional API-level scopes are included
  // in api.b2cScopes
  loginRequest: {
    scopes: string[];
  };
};

const AuthConfig: AzureAuthConfig = {
  client: {
    auth: {
      clientId: process.env.REACT_APP_SCOUT_AZURE_APP_CLIENT_ID || '',
      authority: process.env.REACT_APP_SCOUT_AZURE_FULL_AUTHORITY_URL || '',
      knownAuthorities: (
        process.env.REACT_APP_SCOUT_AZURE_AUTHORITIES || ''
      ).split(';'),
      redirectUri:
        process.env.REACT_APP_SCOUT_CLIENT_URI || 'http://localhost:3000',
    },
  },

  api: {
    b2cScopes: (process.env.REACT_APP_SCOUT_AZURE_B2C_SCOPES || '').split(';'),
  },

  loginRequest: {
    scopes: ['openid', 'offline_access'],
  },
};

export default AuthConfig;
