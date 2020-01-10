import React from 'react';
import {Link} from 'react-router-dom';

export default function Dataset({dataset}) {
  return (
    <div className="dataset" key={dataset.resource.id}>
      <h4 className="dataset-title">
        <Link to={`/dataset/${dataset.resource.id}`}>
          {dataset.resource.name}
        </Link>
      </h4>
      <p className="dataset-description">{dataset.resource.description}</p>
      <p className="dataset-tags">
        {dataset.classification.domain_tags.join(', ')}
      </p>
    </div>
  );
}
