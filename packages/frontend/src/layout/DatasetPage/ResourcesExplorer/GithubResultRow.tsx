import './GithubResultRow.scss';
import ExternalLinkButton from './ExternalLinkButton';
import assertUnreachable from '../../../utils/assertUnreachable';
import { GithubResultMetadata } from './types';

type Props = {
  datasetId: string;
  repoLabel: string;
  repoURL: string;
  resultMetadata: GithubResultMetadata;
};

export default function GithubResultRow({
  datasetId,
  repoLabel,
  repoURL,
  resultMetadata,
}: Props): JSX.Element {
  const searchType = resultMetadata.type === 'COMMIT' ? 'commits' : 'code';
  const repoSearchURL = `${repoURL}/search?q=${datasetId}&type=${searchType}`;

  function renderMetadata(): JSX.Element {
    const resultType = resultMetadata.type;
    switch (resultType) {
      case 'COMMIT': {
        const description = resultMetadata.commitDescription;
        return (
          <>
            <a
              className="github-result-row-metadata__link-label"
              href={resultMetadata.commitURL}
            >
              {resultMetadata.commitLabel}
            </a>
            <p>Commited on {resultMetadata.commitDate}</p>
            <p>
              Description: {description === undefined ? 'N/A' : description}
            </p>
          </>
        );
      }
      case 'CODE':
        return (
          <>
            File:{' '}
            <a
              className="github-result-row-metadata__link-label"
              href={resultMetadata.codeFileURL}
              target="_blank"
              rel="noopener noreferrer"
            >
              {resultMetadata.codeFileLabel}
            </a>
          </>
        );
      default:
        return assertUnreachable(resultType);
    }
  }

  return (
    <div className="github-result-row">
      <div className="github-result-row-header">
        <a
          className="github-result-row-header__link-label"
          target="_blank"
          rel="noopener noreferrer"
          href={repoURL}
        >
          {repoLabel}
        </a>

        <ExternalLinkButton
          href={repoSearchURL}
          iconType="search"
          label="Search repository"
        />
        <ExternalLinkButton
          href={repoURL}
          iconType="external"
          label="Open repository"
        />
      </div>
      <div className="github-result-row-metadata">{renderMetadata()}</div>
    </div>
  );
}
