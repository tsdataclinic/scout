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
import useClipboard from '../../hooks/useClipboard';
import { useGetDatasetsByIds } from '../../hooks/datasets';
import Dataset from '../../components/Dataset/Dataset';

export default function CollectionPage({ match }) {
  const { name, datasetIDs } = match.params;
  const url = window.location.href;
  const datasets = useGetDatasetsByIds(datasetIDs.split(','));

  const [isCopied, setCopied] = useClipboard(url);
  return (
    <div className="collections-page">
      <div className="collections-details">
        <h2>{name}</h2>
        <p>
          {datasets.length} dataset{datasets.length > 1 ? 's' : ''}
        </p>

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
      <div className="collections-content">
        {datasets.map((dataset) => (
          <Dataset viewInOpenPortal key={dataset.id} dataset={dataset} />
        ))}
      </div>
    </div>
  );
}
