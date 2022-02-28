import { useQuery } from 'react-query';
import httpRequest from '../../../utils/httpRequest';
import { GithubResult } from './types';
import { getTokenFromCache } from './useGithubAuth';

export default function useGithubCommitSearch(
  datasetId: string,
): GithubResult[] {
  const githubAuthToken = getTokenFromCache();
  const { data } = useQuery('githubCommitSearch', () =>
    httpRequest('/api/github/search/commits/:datasetId', {
      token: githubAuthToken,
      urlParams: { datasetId },
    }),
  );

  if (data) {
    return data.map(
      ({
        repoURL,
        repoLabel,
        commitLabel,
        commitURL,
        commitDate,
        commitDescription,
      }) => ({
        repoURL,
        repoLabel,
        metadata: {
          commitLabel,
          commitDate,
          commitDescription,
          commitURL,
          type: 'COMMIT',
        },
      }),
    );
  }
  return [];
}
