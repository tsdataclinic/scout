import React from 'react';
import './Dataset.scss';
import { Link } from 'react-router-dom';
import { hilightMatches, formatDate } from '../../utils/formatters';
import { useGetSimilarDatasets, useGetJoinNumbers } from '../../hooks/datasets';
import { ReactComponent as ThematicIcon } from '../../icons/joinable.svg';
import { ReactComponent as JoinIcon } from '../../icons/thematicSimilarity.svg';

// import RawHTML from '../RawHTML/RawHTML';
import ViewOnOpenPortal from '../ViewOnOpenPortal/ViewOnOpenPortal';

export default function Dataset({
  dataset,
  onAddToCollection,
  onRemoveFromCollection,
  inCollection,
  viewInOpenPortal = false,
  similarity,
  query,
}) {
  const formattedName = hilightMatches(dataset.resource.name, query);
  const similarDatasets = useGetSimilarDatasets(dataset.resource.id);
  const joinNumber = useGetJoinNumbers(dataset.resource.id);
  const formattedDescription = hilightMatches(
    dataset.resource.description,
    query,
  );
  return (
    <div className="dataset" key={dataset.resource.id}>
      <div className="dataset-title">
        <p>{dataset.resource.attribution}</p>
        <Link className="title" to={`/dataset/${dataset.resource.id}`}>
          <h2>{formattedName}</h2>
        </Link>
      </div>

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
      {similarity && (
        <p className="similarity">
          <p className="header">Similarity</p>
          <p>{(similarity * 100).toPrecision(2)}%</p>
        </p>
      )}
      {viewInOpenPortal && <ViewOnOpenPortal permalink={dataset.permalink} />}
      <div className="comparison-stats">
        <div className="comparison-stat dataset-join-thematic">
          <ThematicIcon />
          <span>{Math.max(similarDatasets.length - 1, 0)}</span>
        </div>
        <div className="comparison-stat dataset-join-join">
          <JoinIcon />
          <span>{joinNumber}</span>
        </div>
      </div>
      <div className="dataset-description">{formattedDescription}</div>
      <div className="dataset-meta">
        <div className="update-frequency">
          <span>Update frequency:</span>
          weekly
        </div>
        <div className="dataset-last-updated">
          <span>Last Update at:</span>
          {formatDate(dataset.resource.updatedAt)}
        </div>
      </div>
    </div>
  );
}
