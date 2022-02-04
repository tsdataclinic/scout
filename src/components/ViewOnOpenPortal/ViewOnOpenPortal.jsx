import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

export default function ViewOnOpenPortal({ permalink }) {
  return (
    <a
      className="external-link"
      target="_blank"
      rel="noopener noreferrer"
      href={permalink}
    >
      <button type="button">
        View on Open Data&nbsp;
        <FontAwesomeIcon icon={faExternalLinkAlt} />
      </button>
    </a>
  );
}
