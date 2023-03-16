import './Dataset.scss';
import numeral from 'numeral';
import { hilightMatches, formatDate } from '../../utils/formatters';
import { useGetSimilarDatasets, useGetJoinNumbers } from '../../hooks/datasets';
import { ReactComponent as ThematicIcon } from '../../icons/joinable.svg';
import { ReactComponent as JoinIcon } from '../../icons/thematicSimilarity.svg';
import DatasetLink from '../DatasetLink/DatasetLink';
import ViewOnOpenPortal from '../ViewOnOpenPortal/ViewOnOpenPortal';
import PortalInfo from '../PortalInfo/PortalInfo';
import AddToCollectionButton from '../AddToCollectionButton';

export default function Dataset({
  dataset,
  viewInOpenPortal = false,
  similarity,
  query,
  showStats = true,
  showCollectionButtons = true,
  selectedCategories = [],
}) {
  const formattedName = hilightMatches(dataset.name, query);
  const similarDatasets = useGetSimilarDatasets(dataset).home;
  const joinNumber = useGetJoinNumbers(dataset);
  const formattedDescription = hilightMatches(dataset.description, query);

  const { portal } = dataset; // dataset ? portalForDomain(dataset.portal) : null;

  return (
    <div className="dataset" key={dataset.id}>
      <div className="dataset-title">
        <div className="hierarchy mb-2">
          <PortalInfo portal={portal} />
          <p>{dataset.department}</p>
        </div>

        <DatasetLink className="data-link-title title" dataset={dataset}>
          <h2>{formattedName}</h2>
        </DatasetLink>
        <span className="text-sm">{dataset.permalink}</span>
      </div>
      {showCollectionButtons ? (
        <AddToCollectionButton datasetId={dataset.id} />
      ) : null}
      {similarity && (
        <p className="similarity">
          <p className="header">Similarity</p>
          <p>{numeral(similarity).format('0%')}</p>
        </p>
      )}
      {viewInOpenPortal && <ViewOnOpenPortal permalink={dataset.permalink} />}
      {
        /* TODO: remove this stats feature and the associated css */
        showStats && (
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
        )
      }
      <div className="dataset-description text-sm">{formattedDescription}</div>
      <div className="dataset-meta">
        <div className="update-frequency text-sm">
          <span>Update frequency:</span>
          {dataset.updateFrequency}
        </div>
        <div className="dataset-last-updated text-sm">
          <span>Last Update:</span>
          {formatDate(dataset.updatedAt)}
        </div>
        {selectedCategories && (
          <div className="dataset-matching-categories">
            {selectedCategories
              .filter(cat => dataset.categories.includes(cat))
              .map(category => (
                <div className="dataset-category-info" key={category}>
                  <p>{category}</p>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
