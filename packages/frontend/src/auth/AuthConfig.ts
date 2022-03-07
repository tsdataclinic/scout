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
      authority:
        'https://twosigmadataclinic.b2clogin.com/twosigmadataclinic.onmicrosoft.com/B2C_1_scout_signup_signin',
      knownAuthorities: ['twosigmadataclinic.b2clogin.com'],
      redirectUri:
        process.env.REACT_APP_SCOUT_CLIENT_URI || 'http://localhost:3000',
    },
  },

  api: {
    b2cScopes: [
      'https://twosigmadataclinic.onmicrosoft.com/scout-api/Scout.Read',
      'https://twosigmadataclinic.onmicrosoft.com/scout-api/Scout.Write',
    ],
  },

  loginRequest: {
    scopes: ['openid', 'offline_access'],
  },
};

export default AuthConfig;
