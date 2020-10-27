import React from 'react';
import './Dataset.scss';
import { hilightMatches, formatDate } from '../../utils/formatters';
import { useGetSimilarDatasets, useGetJoinNumbers } from '../../hooks/datasets';
import { ReactComponent as ThematicIcon } from '../../icons/joinable.svg';
import { ReactComponent as JoinIcon } from '../../icons/thematicSimilarity.svg';
import { portalForDomain } from '../../portals';

import DatasetLink from '../DatasetLink/DatasetLink';
// import RawHTML from '../RawHTML/RawHTML';
import ViewOnOpenPortal from '../ViewOnOpenPortal/ViewOnOpenPortal';
import PortalInfo from '../PortalInfo/PortalInfo';

export default function Dataset({
  dataset,
  onAddToCollection,
  onRemoveFromCollection,
  inCollection,
  viewInOpenPortal = false,
  similarity,
  query,
  showStats = true,
}) {
  const formattedName = hilightMatches(dataset.name, query);
  const similarDatasets = useGetSimilarDatasets(dataset).home;
  const joinNumber = useGetJoinNumbers(dataset);
  const formattedDescription = hilightMatches(dataset.description, query);

  const {portal} = dataset; // dataset ? portalForDomain(dataset.portal) : null;

  return (
    <div className="dataset" key={dataset.id}>
      <div className="dataset-title">
        <div className="hierarchy">
          <PortalInfo portal={portal} />
          <p>{dataset.department}</p>
        </div>

        <DatasetLink className="title" dataset={dataset}>
          {/* <Link className="title" to={`/dataset/${dataset.id}`}> */}
          <h2>{formattedName}</h2>
          {/* </Link> */}
        </DatasetLink>
        {dataset.permalink}
      </div>

      {onAddToCollection && (
        <button
          type="button"
          onClick={() =>
            inCollection
              ? onRemoveFromCollection(dataset.id)
              : onAddToCollection(dataset.id)
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
      {showStats && (
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
      )}
      <div className="dataset-description">{formattedDescription}</div>
      <div className="dataset-meta">
        <div className="update-frequency">
          <span>Update frequency:</span>
          weekly
        </div>
        <div className="dataset-last-updated">
          <span>Last Update at:</span>
          {formatDate(dataset.updatedAt)}
        </div>
      </div>
    </div>
  );
}
