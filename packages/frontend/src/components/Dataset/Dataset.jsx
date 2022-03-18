import './Dataset.scss';
import numeral from 'numeral';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import Button from 'react-bootstrap/Button';
import { hilightMatches, formatDate } from '../../utils/formatters';
import { useGetSimilarDatasets, useGetJoinNumbers } from '../../hooks/datasets';
import { ReactComponent as ThematicIcon } from '../../icons/joinable.svg';
import { ReactComponent as JoinIcon } from '../../icons/thematicSimilarity.svg';
import { useUserCollections } from '../../hooks/collections';
import DatasetLink from '../DatasetLink/DatasetLink';
import ViewOnOpenPortal from '../ViewOnOpenPortal/ViewOnOpenPortal';
import PortalInfo from '../PortalInfo/PortalInfo';
import 'bootstrap/dist/css/bootstrap.css';
import { CollectionTabAdd } from '../CollectionTab/CollectionTabAdd';

export default function Dataset({
  dataset,
  viewInOpenPortal = false,
  similarity,
  query,
  showStats = true,
  showCollectionButtons = true,
}) {
  const formattedName = hilightMatches(dataset.name, query);
  const similarDatasets = useGetSimilarDatasets(dataset).home;
  const joinNumber = useGetJoinNumbers(dataset);
  const formattedDescription = hilightMatches(dataset.description, query);

  const { portal } = dataset; // dataset ? portalForDomain(dataset.portal) : null;

  const [
    ,
    {
      addToCurrentCollection,
      removeFromCurrentCollection,
      inCurrentCollection,
    },
  ] = useUserCollections();

  const inCollection = inCurrentCollection(dataset.id);

  return (
    <div className="dataset" key={dataset.id}>
      <div className="dataset-title">
        <div className="hierarchy">
          <PortalInfo portal={portal} />
          <p>{dataset.department}</p>
        </div>

        <DatasetLink className="title" dataset={dataset}>
          <h2>{formattedName}</h2>
        </DatasetLink>
        {dataset.permalink}
      </div>
      {showCollectionButtons && (
        <OverlayTrigger
          placement="bottom"
          trigger="click"
          overlay={
            <Popover>
              <Popover.Title as="h3">Select a Collection</Popover.Title>
              <Popover.Content>
                <CollectionTabAdd />
              </Popover.Content>
            </Popover>
          }
        >
          <Button
            className="addCollectionButton"
            variant="success"
            onClick={() =>
              inCollection
                ? removeFromCurrentCollection(dataset.id)
                : addToCurrentCollection(dataset.id)
            }
          >
            {inCollection ? 'Remove from collection' : 'Add to collection'}{' '}
          </Button>
        </OverlayTrigger>
      )}
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
      <div className="dataset-description">{formattedDescription}</div>
      <div className="dataset-meta">
        <div className="update-frequency">
          <span>Update frequency:</span>
          {dataset.updateFrequency}
        </div>
        <div className="dataset-last-updated">
          <span>Last Update:</span>
          {formatDate(dataset.updatedAt)}
        </div>
      </div>
    </div>
  );
}
