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
import { useGetDatasetsByIds } from '../../hooks/datasets';
import Dataset from '../../components/Dataset/Dataset';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import { useCollection } from '../../hooks/graphQLAPI';

export default function CollectionPage({ match }) {
  usePageView();
  const { name, datasetIDs, id } = match.params;
  const { loading, data, error } = useCollection(id);

  const url = window.location.href;
  const [isCopied, setCopied] = useClipboard(url);
  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Something went wrong</p>;
  }

  const collection = data.collection;
  const { datasets, description } = collection;
  // const datasets = useGetDatasetsByIds(datasetIDs.split(','));
  console.log('datasets are ', datasets);
  return (
    <div className="collection-page">
      <div className="collection-details">
        <section>
          <Breadcrumb currentPage="Collections" />
        </section>
        <section>
          <h2>{name ? name : collection.name}</h2>
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
        {datasets.map((dataset) => (
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
