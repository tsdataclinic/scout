import './CollectionPage.scss';
import { useParams } from 'react-router-dom';
import {
  EmailShareButton,
  FacebookShareButton,
  TwitterShareButton,
  EmailIcon,
  FacebookIcon,
  TwitterIcon,
} from 'react-share';
import usePageView from '../../hooks/analytics';
import useClipboard from '../../hooks/useClipboard';
import Dataset from '../../components/Dataset/Dataset';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import { useCollection, useDatasetsFromIds } from '../../hooks/graphQLAPI';
import { useUserCollections } from '../../hooks/collections';
import useCurrentUser from '../../auth/useCurrentUser';

const EMPTY_COLLECTION = {
  datasetIds: [],
  description: '',
  name: '',
};

function getShareableURL(collectionName, datasetIds) {
  const urlOrigin = window.location.origin;
  const datasetIdsStr = datasetIds.join(',');
  return `${urlOrigin}/collection/${collectionName}/${datasetIdsStr}`;
}

export default function CollectionPage() {
  usePageView();
  const { isAuthenticated } = useCurrentUser();
  const { name, datasetIds: datasetIdsFromURL, id } = useParams();
  const loadingCollectionFromURL = !!datasetIdsFromURL;
  const [{ collections }] = useUserCollections();
  const { loading, data, error } = useCollection(id);

  // first try to load a collection to get the dataset ids to load
  let collection = isAuthenticated
    ? data?.collection
    : collections.find(col => col.id === id);

  let datasetIdsToLoad;
  if (datasetIdsFromURL === undefined) {
    if (isAuthenticated && collection) {
      datasetIdsToLoad = collection.datasets.map(d => d.id);
    } else {
      datasetIdsToLoad = collection ? collection.datasetIds : [];
    }
  } else {
    datasetIdsToLoad = datasetIdsFromURL.split(',');
  }

  const datasets =
    useDatasetsFromIds(datasetIdsToLoad).data?.datasetsByIds || [];

  if (collection === undefined && !loadingCollectionFromURL) {
    // load something empty by default until we've retrieved the collection
    collection = EMPTY_COLLECTION;
  }

  if (loadingCollectionFromURL) {
    collection = {
      name,
      datasetIds: datasetIdsToLoad,
      description: 'Shared collection',
    };
  }

  const { description, name: collectionName } = collection;

  const shareableURL = getShareableURL(collection.name, datasetIdsToLoad);
  const [isCopied, setCopied] = useClipboard(shareableURL);

  if (loading || (collections.length === 0 && !loadingCollectionFromURL)) {
    return <p>Loading...</p>;
  }

  if (
    (error && isAuthenticated && !loadingCollectionFromURL) ||
    (!isAuthenticated && collections.length >= 1 && collection === undefined)
  ) {
    return <p>Something went wrong</p>;
  }

  return (
    <div className="collection-page">
      <div className="collection-details">
        <section>
          <Breadcrumb currentPage="Collections" />
        </section>
        <section>
          <h2>{collectionName}</h2>
          {description && <h3>{description}</h3>}
          <p>
            {datasets.length} dataset
            {datasets.length > 1 ? 's' : ''}
          </p>
        </section>
        <div>
          <h3>Share this collection:</h3>
          <p className="dataset-url">{shareableURL} </p>
          <button type="button" onClick={setCopied}>
            Copy link
          </button>
          <span>{isCopied ? 'Copied!' : ' '} </span>
          <p className="share-icons">
            <FacebookShareButton url={shareableURL}>
              <FacebookIcon size={36} />
            </FacebookShareButton>{' '}
            <TwitterShareButton url={shareableURL}>
              <TwitterIcon size={36} />
            </TwitterShareButton>
            <EmailShareButton url={shareableURL}>
              <EmailIcon size={36} />
            </EmailShareButton>
          </p>
        </div>
      </div>
      <div className="collection-content">
        {datasets.map(dataset => (
          <Dataset
            showCollectionButtons={false}
            viewInOpenPortal
            key={dataset.id}
            dataset={dataset}
            showStats={false}
          />
        ))}
      </div>
    </div>
  );
}
