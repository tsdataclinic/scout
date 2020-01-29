import React from 'react';
import './Dataset.scss';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/formatters';
import RawHTML from '../RawHTML/RawHTML';

export default function Dataset({
  dataset,
  onAddToCollection,
  onRemoveFromCollection,
  inCollection,
}) {
  return (
    <div className="dataset" key={dataset.resource.id}>
      <div className="dataset-title">
        <Link to={`/dataset/${dataset.resource.id}`}>
          <h2>{dataset.resource.name}</h2>
        </Link>
        <p>{dataset.resource.attribution}</p>
      </div>

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
