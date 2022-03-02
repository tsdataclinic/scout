import './ResourcesExplorer.scss';
import GithubResultGroup from './GithubResultGroup';
import useGithubAuth from './useGithubAuth';
import useGithubCommitSearch from './useGithubCommitSearch';
import useGithubCodeSearch from './useGithubCodeSearch';

type Props = {
  datasetID: string;
};

export default function ResourcesExplorer({ datasetID }: Props): JSX.Element {
  const githubAuthToken = useGithubAuth();
  const commitResults = useGithubCommitSearch(datasetID);
  const codeResults = useGithubCodeSearch(datasetID);

  return (
    <div className="resources-explorer">
      <p>Find code examples on GitHub</p>
      <GithubResultGroup
        datasetID={datasetID}
        resultType="COMMIT"
        results={commitResults}
        githubAuthToken={githubAuthToken}
      />
      <GithubResultGroup
        datasetID={datasetID}
        resultType="CODE"
        results={codeResults}
        githubAuthToken={githubAuthToken}
      />
    </div>
  );
}
