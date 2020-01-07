import React from 'react';

export default function Dataset({dataset}) {
  return (
    <div className="dataset" key={dataset.id}>
      <h4>
        <a target="_blank" href={dataset.permalink}>
          {dataset.resource.name}
        </a>
      </h4>
      <p>{dataset.resource.description}</p>
      <p>{dataset.classification.domain_tags.join(', ')}</p>
    </div>
  );
}
