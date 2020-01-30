import React from 'react';
import './Dataset.scss';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { formatDate } from '../../utils/formatters';
import RawHTML from '../RawHTML/RawHTML';

export default function Dataset({
  dataset,
  onAddToCollection,
  onRemoveFromCollection,
  inCollection,
  viewInOpenPortal = false,
  similarity,
}) {
  return (
    <div className="dataset" key={dataset.resource.id}>
      <div className="dataset-title">
        <Link to={`/dataset/${dataset.resource.id}`}>
          <h2>{dataset.resource.name}</h2>
        </Link>
        <p>{dataset.resource.attribution}</p>
      </div>

      {similarity && <p>Similarity: {(similarity * 100).toPrecision(2)}%</p>}
      {onAddToCollection && (
        <button
          className="collection-button"
          type="button"
          onClick={() =>
            inCollection
              ? onRemoveFromCollection(dataset.resource.id)
              : onAddToCollection(dataset.resource.id)
          }
        >
          {inCollection ? 'Remove from collection' : 'Add to collection'}
        </button>
      )}
      {viewInOpenPortal && (
        <a
          className="external-link"
          target="_blank"
          rel="noopener noreferrer"
          href={dataset.permalink}
        >
          <button type="button">
            View on Open Data&nbsp;
            <FontAwesomeIcon icon={faExternalLinkAlt} />
          </button>
        </a>
      )}

      <div className="dataset-last-update">
        <p className="header">Last Updated</p>
        <p>{formatDate(dataset.resource.updatedAt)}</p>
      </div>

      <RawHTML
        className="dataset-description"
        html={dataset.resource.description}
      />
      <div className="dataset-meta">
        <div className="update-frequency">
          <span>Update frequency:</span>
          weekly
        </div>
        <div className="dataset-tags">
          <span>Tags:</span>
          {dataset.classification.domain_tags.join(', ')}
        </div>
      </div>
    </div>
  );
}
