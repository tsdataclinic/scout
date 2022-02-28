import './ExamplesExplorer.scss';
import { useQuery } from 'react-query';
import { useMemo } from 'react';
import { GithubResult } from './types';
import GithubResultGroup from './GithubResultGroup';

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

export default function ExamplesExplorer({ datasetId }: Props): JSX.Element {
  const { data } = useQuery('githubCommitSearch', () =>
    fetch('/api/github/search/commits').then(res => res.json()),
  );

  console.log(data);

  // TODO: NEXT UP: github auth
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
    <div className="examples-explorer">
      <p>Find examples on GitHub</p>
      <GithubResultGroup
        datasetId={datasetId}
        resultType="COMMIT"
        results={codeResults}
      />
      <GithubResultGroup
        datasetId={datasetId}
        resultType="CODE"
        results={commitResults}
      />
    </div>
  );
}
