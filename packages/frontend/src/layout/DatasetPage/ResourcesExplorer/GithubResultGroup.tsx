import './GithubResultGroup.scss';
import ExternalLinkButton from './ExternalLinkButton';
import GithubResultRow from './GithubResultRow';
import { GithubResult, GithubResultType } from './types';
import resultTypeToLabel from './resultTypeToLabel';

type Props = {
  githubAuthToken: string | void;
  datasetID: string;
  resultType: GithubResultType;
  results: readonly GithubResult[];
};

function getGithubRequestAuthURL(): string {
  const url = new URL('https://github.com/login/oauth/authorize');
  url.searchParams.append(
    'client_id',
    process.env.REACT_APP_SCOUT_GITHUB_CLIENT_ID ?? '',
  );
  url.searchParams.append('redirect_uri', window.location.href);
  return url.href;
}

export default function GithubResultGroup({
  githubAuthToken,
  datasetID,
  resultType,
  results,
}: Props): JSX.Element {
  const rows = results.map(({ repoURL, repoLabel, metadata }: GithubResult) => (
    <GithubResultRow
      datasetID={datasetID}
      key={repoURL}
      repoURL={repoURL}
      repoLabel={repoLabel}
      resultMetadata={metadata}
    />
  ));

  function renderRows(): JSX.Element {
    if (results.length === 0) {
      const pluralTypeLabel =
        resultType === 'COMMIT' ? 'commits' : 'code results';
      return (
        <div>Could not find any {pluralTypeLabel} matching this dataset</div>
      );
    }

    return <div>{rows}</div>;
  }

  return (
    <div className="github-result-group">
      <p className="github-result-group__header-label">
        {resultTypeToLabel(resultType)}
      </p>
      {resultType === 'CODE' && githubAuthToken === undefined ? (
        <>
          <div>Searching for code examples requires GitHub authentication</div>
          <ExternalLinkButton
            href={getGithubRequestAuthURL()}
            iconType="external"
            label="Login to GitHub"
          />
        </>
      ) : (
        renderRows()
      )}
    </div>
  );
}
