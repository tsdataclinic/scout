import React from 'react';
import './Dataset.scss';
import { Link } from 'react-router-dom';
import { hilightMatches, formatDate } from '../../utils/formatters';

// import RawHTML from '../RawHTML/RawHTML';
import ViewOnOpenPortal from '../ViewOnOpenPortal/ViewOnOpenPortal';

export default function Dataset({
  dataset,
  onAddToCollection,
  onRemoveFromCollection,
  inCollection,
  viewInOpenPortal = false,
  similarity,
  matches,
}) {
  const formattedName = hilightMatches(
    dataset.resource.name,
    matches?.find((m) => m.key === 'resource.name'),
  );
  const formattedDescription = hilightMatches(
    dataset.resource.description,
    matches?.find((m) => m.key === 'resource.description'),
  );
  return (
    <div className="dataset" key={dataset.resource.id}>
      <div className="dataset-title">
        <Link className="title" to={`/dataset/${dataset.resource.id}`}>
          <h2>{formattedName}</h2>
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
      {viewInOpenPortal && <ViewOnOpenPortal permalink={dataset.permalink} />}

      <div className="dataset-last-update">
        <p className="header">Last Updated</p>
        <p>{formatDate(dataset.resource.updatedAt)}</p>
      </div>
      <div className="dataset-description">{formattedDescription}</div>
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
