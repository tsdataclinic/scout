import './ResourcesExplorer.scss';
import { useQuery } from 'react-query';
import { useState, useEffect, useMemo } from 'react';
import { GithubResult } from './types';
import GithubResultGroup from './GithubResultGroup';

const GITHUB_TOKEN_LOCAL_STORAGE_KEY = 'githubToken';

const RESULTS_DATA: readonly GithubResult[] = [
  {
    datasetId: '43nn-pn8j',
    repoLabel: 'OpenGeoMetadata/gov.data',
    repoURL: 'https://github.com/OpenGeoMetadata/gov.data',
    metadata: {
      type: 'CODE',
      codeFileLabel:
        'c0/fd/d9/d1/fb/14/46/20/bc/f2/15/97/d8/48/f6/e1/c0fdd9d1fb144620bcf21597d848f6e1/ckan.json',
      codeFileURL:
        'https://github.com/OpenGeoMetadata/gov.data/blob/6462326caafc6f849ca23bf7b4ca0742f49d2704/c0/fd/d9/d1/fb/14/46/20/bc/f2/15/97/d8/48/f6/e1/c0fdd9d1fb144620bcf21597d848f6e1/ckan.json',
    },
  },
  {
    datasetId: '43nn-pn8j',
    repoLabel: 'arybak149/LAG_DATA_2021',
    repoURL: 'https://github.com/arybak149/LAG_DATA_2021',
    metadata: {
      type: 'COMMIT',
      commitLabel: 'Rename 43nn-pn8j.csv to NYC Restaurant Inspection Results',
      commitDate: 'Jul 16, 2021',
      commitDescription: undefined,
      commitURL:
        'https://github.com/arybak149/LAG_DATA_2021/commit/a3ceae76d08a3d6717b2d3644c422e3735281da3',
    },
  },
  {
    datasetId: '43nn-pn8j',
    repoLabel: 'megan-owen/MAT328-Techniques_in_Data_Science',
    repoURL: 'https://github.com/megan-owen/MAT328-Techniques_in_Data_Science',
    metadata: {
      type: 'COMMIT',
      commitLabel: 'Add files via upload',
      commitDate: 'Jul 16, 2021',
      commitDescription:
        'Downloaded rows with inspection data in February 2020 from https://data.cityofnewyork.us/Health/DOHMH-New-York-City-Restaurant-Inspection-Results/43nn-pn8j/data',
      commitURL:
        'https://github.com/arybak149/LAG_DATA_2021/commit/a3ceae76d08a3d6717b2d3644c422e3735281da3',
    },
  },
];

type Props = {
  datasetId: string;
};

function useGithubCodeForAuth(): string | void {
  const [githubToken, setGithubToken] = useState<string | undefined>(
    () =>
      window.localStorage.getItem(GITHUB_TOKEN_LOCAL_STORAGE_KEY) || undefined,
  );

  useEffect(() => {
    async function authenticate(githubAuthCode: string): Promise<void> {
      const response = await fetch(`/api/github/authenticate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          authCode: githubAuthCode,
        }),
      });
      const { token } = await response.json();
      if (token) {
        window.localStorage.setItem(GITHUB_TOKEN_LOCAL_STORAGE_KEY, token);
        console.log('TOKEN', token);
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

export default function ResourcesExplorer({ datasetId }: Props): JSX.Element {
  const { data } = useQuery('githubCommitSearch', () =>
    fetch('/api/github/search/commits').then(res => res.json()),
  );

  console.log(data);

  const githubAuthToken = useGithubCodeForAuth();

  const [codeResults, commitResults] = useMemo(() => {
    const codeObjs: GithubResult[] = [];
    const commitObjs: GithubResult[] = [];
    RESULTS_DATA.forEach(result => {
      if (result.metadata.type === 'CODE') {
        codeObjs.push(result);
      } else {
        commitObjs.push(result);
      }
    });
    return [codeObjs, commitObjs];
  }, []);

  return (
    <div className="resources-explorer">
      <p>Find code examples on GitHub</p>
      <GithubResultGroup
        datasetId={datasetId}
        resultType="COMMIT"
        results={codeResults}
        githubAuthToken={githubAuthToken}
      />
      <GithubResultGroup
        datasetId={datasetId}
        resultType="CODE"
        results={commitResults}
        githubAuthToken={githubAuthToken}
      />
    </div>
  );
}
