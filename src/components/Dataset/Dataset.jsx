import React from 'react';
import './Dataset.scss';
import { Link } from 'react-router-dom';
import RawHTML from '../RawHTML/RawHTML';

export default function Dataset({ dataset }) {
  return (
    <div className="dataset" key={dataset.resource.id}>
      <h4 className="dataset-title">
        <Link to={`/dataset/${dataset.resource.id}`}>
          {dataset.resource.name}
        </Link>
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
