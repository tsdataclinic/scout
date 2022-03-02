import { useQuery } from 'react-query';
import httpRequest from '../../../utils/httpRequest';
import { GithubResult } from './types';
import { getTokenFromCache } from './useGithubAuth';

export default function useGithubCommitSearch(
  datasetID: string,
): GithubResult[] {
  const githubAuthToken = getTokenFromCache();
  const { data } = useQuery('githubCodeSearch', () =>
    httpRequest('/api/github/search/code/:datasetID', {
      token: githubAuthToken,
      urlParams: { datasetID },
    }),
  );

  if (data) {
    return data.map(({ repoURL, repoLabel, codeFileLabel, codeFileURL }) => ({
      repoURL,
      repoLabel,
      metadata: {
        codeFileLabel,
        codeFileURL,
        type: 'CODE',
      },
    }));
  }
  return [];
}
