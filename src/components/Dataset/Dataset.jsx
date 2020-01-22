import React from 'react';
import './Dataset.scss';
import { Link } from 'react-router-dom';
import RawHTML from '../RawHTML/RawHTML';

export default function Dataset({
  dataset,
  onAddToCollection,
  onRemoveFromCollection,
  inCollection,
}) {
  console.log(inCollection);
  return (
    <div className="dataset" key={dataset.resource.id}>
      <h4 className="dataset-title">
        <Link to={`/dataset/${dataset.resource.id}`}>
          {dataset.resource.name}
        </Link>
        {onAddToCollection && (
          <button
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
      </h4>
      <RawHTML
        className="dataset-description"
        html={dataset.resource.description}
      />
      <p className="dataset-tags">
        {dataset.classification.domain_tags.join(', ')}
      </p>
    </div>
  );
}
