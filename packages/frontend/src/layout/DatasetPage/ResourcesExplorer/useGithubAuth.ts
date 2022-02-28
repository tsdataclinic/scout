import { useEffect, useState } from 'react';
import httpRequest from '../../../utils/httpRequest';

const GITHUB_TOKEN_LOCAL_STORAGE_KEY = 'githubToken';

export function getTokenFromCache(): string | undefined {
  return (
    window.localStorage.getItem(GITHUB_TOKEN_LOCAL_STORAGE_KEY) || undefined
  );
}

export default function useGithubAuth(): string | undefined {
  const [githubToken, setGithubToken] = useState<string | undefined>(() =>
    getTokenFromCache(),
  );

  useEffect(() => {
    async function authenticate(githubAuthCode: string): Promise<void> {
      const { token } = await httpRequest('/api/github/authenticate', {
        body: {
          authCode: githubAuthCode,
        },
      });

      if (token) {
        window.localStorage.setItem(GITHUB_TOKEN_LOCAL_STORAGE_KEY, token);
        setGithubToken(token);
      }
    }

    if (!window.localStorage.getItem(GITHUB_TOKEN_LOCAL_STORAGE_KEY)) {
      // check if there is a github code in the URL
      // (github sets this when it redirects the user back to Scout)
      const match = window.location.href.match(/\?code=(.*)/);
      if (match) {
        const code = match[1];
        if (code) {
          authenticate(code);
        }
      }
    }
  }, []);

  return githubToken;
}
