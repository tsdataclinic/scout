import React from 'react';
import './CollectionCard.scss';

import { formatDate } from '../../utils/formatters';

export default function CollectionCard({ collection }) {
  console.log('Collection', collection);
  return (
    <div className="collection-card">
      <p className="created-at">
        Collection created {formatDate(collection.createdAt)}
      </p>
      <h3>{collection.name}</h3>
      <div className="collection-stats">
        <span>
          Datasets: {collection.datasetIds ? collection.datasetIds.length : 0}
        </span>
      </div>
    </div>
  );
}
