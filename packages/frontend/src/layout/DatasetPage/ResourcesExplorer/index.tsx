import './ResourcesExplorer.scss';
import GithubResultGroup from './GithubResultGroup';
import useGithubAuth from './useGithubAuth';
import useGithubCommitSearch from './useGithubCommitSearch';
import useGithubCodeSearch from './useGithubCodeSearch';

type Props = {
  datasetId: string;
};

export default function ResourcesExplorer({ datasetId }: Props): JSX.Element {
  const githubAuthToken = useGithubAuth();
  const commitResults = useGithubCommitSearch(datasetId);
  const codeResults = useGithubCodeSearch(datasetId);

  return (
    <div className="resources-explorer">
      <p>Find code examples on GitHub</p>
      <GithubResultGroup
        datasetId={datasetId}
        resultType="COMMIT"
        results={commitResults}
        githubAuthToken={githubAuthToken}
      />
      <GithubResultGroup
        datasetId={datasetId}
        resultType="CODE"
        results={codeResults}
        githubAuthToken={githubAuthToken}
      />
    </div>
  );
}
