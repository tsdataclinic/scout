import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt, faSearch } from '@fortawesome/free-solid-svg-icons';

type Props = {
  href: string;
  iconType: 'search' | 'external';
  label: string;
};

export default function ExternalLinkButton({
  href,
  iconType,
  label,
}: Props): JSX.Element {
  const icon = iconType === 'search' ? faSearch : faExternalLinkAlt;

  return (
    <a target="_blank" rel="noopener noreferrer" href={href}>
      <button
        className="github-result-row-header__external-link-btn"
        type="button"
      >
        <span className="github-result-row-header__external-link-text">
          {label}
        </span>
        <FontAwesomeIcon icon={icon} />
      </button>
    </a>
  );
}
