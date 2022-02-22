import React from 'react';
import './CollectionPage.scss';
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
import { USE_SINGLE_CITY } from '../../flags';

export default function CollectionPage({ match }) {
  usePageView();
  const { name, datasetIDs: datasetIdsFromURL, id } = match.params;
  const [{ collections }] = useUserCollections();
  const { loading, data, error } = useCollection(id);

  const url = window.location.href;
  const [isCopied, setCopied] = useClipboard(url);

  const collection = (USE_SINGLE_CITY
    ? collections.find(col => col.id === id)
    : data.collection) || {
    datasetIds: [],
    description: '',
    name: '',
  };

  const { datasetIds, description } = collection;
  const datasets =
    useDatasetsFromIds(datasetIdsFromURL || datasetIds).data?.datasetsByIds ||
    [];

  if (loading || collections.length === 0) {
    return <p>Loading...</p>;
  }

  if (
    (error && !USE_SINGLE_CITY) ||
    (USE_SINGLE_CITY && collections.length >= 1 && collection === undefined)
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
          <h2>{name || collection.name}</h2>
          {description && <h3>{description}</h3>}
          <p>
            {datasets.length} dataset
            {datasets.length > 1 ? 's' : ''}
          </p>
        </section>

        <div>
          <h3>Share this collection:</h3>
          <p className="dataset-url">{url} </p>
          <button type="button" onClick={setCopied}>
            Copy link
          </button>
          <span>{isCopied ? 'Copied!' : ' '} </span>
          <p className="share-icons">
            <FacebookShareButton url={url}>
              <FacebookIcon size={36} />
            </FacebookShareButton>{' '}
            <TwitterShareButton url={url}>
              <TwitterIcon size={36} />
            </TwitterShareButton>
            <EmailShareButton url={url}>
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
          />
        ))}
      </div>
    </div>
  );
}
