import './GithubResultGroup.scss';
import ExternalLinkButton from './ExternalLinkButton';
import GithubResultRow from './GithubResultRow';
import { GithubResult, GithubResultType } from './types';
import resultTypeToLabel from './resultTypeToLabel';

type Props = {
  githubAuthToken: string | void;
  datasetId: string;
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
  datasetId,
  resultType,
  results,
}: Props): JSX.Element {
  const rows = results.map(({ repoURL, repoLabel, metadata }: GithubResult) => (
    <GithubResultRow
      datasetId={datasetId}
      key={repoURL}
      repoURL={repoURL}
      repoLabel={repoLabel}
      resultMetadata={metadata}
    />
  ));

  console.log(process.env);

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
        <div>{rows}</div>
      )}
    </div>
  );
}
