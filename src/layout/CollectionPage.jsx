import React from 'react';
import { useCopyClipboard } from '@lokibai/react-use-copy-clipboard';

import {
  EmailShareButton,
  FacebookShareButton,
  TwitterShareButton,
  EmailIcon,
  FacebookIcon,
  TwitterIcon,
} from 'react-share';
import { useDatasets } from '../hooks/datasets';
import Dataset from '../components/Dataset/Dataset';

export default function CollectionPage({ match }) {
  const { name, datasetIDs } = match.params;
  const url = window.location.href;
  const datasets = useDatasets({ ids: datasetIDs.split(',') });

  const [isCopied, setCopied] = useCopyClipboard(`${url}`);
  return (
    <div className="collections-page">
      <h1>{name}</h1>
      {datasets.map((dataset) => (
        <Dataset dataset={dataset} />
      ))}
      <div className="share">
        Share this collection:
        <p>
          <FacebookShareButton url={url}>
            <FacebookIcon />
          </FacebookShareButton>{' '}
          <TwitterShareButton url={url}>
            <TwitterIcon />
          </TwitterShareButton>
          <EmailShareButton url={url}>
            <EmailIcon />
          </EmailShareButton>
        </p>
        <p>
          Share link {url}{' '}
          <button type="button" onClick={setCopied}>
            {' '}
            {isCopied ? 'Copied' : 'Copy'}{' '}
          </button>
        </p>
      </div>
    </div>
  );
}
