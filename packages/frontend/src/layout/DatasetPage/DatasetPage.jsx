import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Switch } from 'antd';
import RawHTML from '../../components/RawHTML/RawHTML';
import ColumnMatchTable from '../../components/ColumnMatchTable/ColumnMatchTable';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import '../../components/Loading/Loading.scss';
import usePageView from '../../hooks/analytics';
import { useUserCollections } from '../../hooks/collections';
import './DatasetPage.scss';
import ViewOnOpenPortal from '../../components/ViewOnOpenPortal/ViewOnOpenPortal';
import { useDatasetGQL } from '../../hooks/graphQLAPI';
import { ThematicSimilarityExplorer } from '../../components/ThematicSimilarityExplorer/ThematicSimilarityExplorer';
import { USE_SINGLE_CITY } from '../../flags';

const formatDate = date => moment(date).format('MMMM DD, YYYY');

export default function DatasetPage({ match }) {
  // debugger;
  usePageView();
  const { datasetID } = match.params;

  const { loading, error, data } = useDatasetGQL(datasetID);
  const dataset = loading || error ? null : data.dataset;

  // const parentId = dataset?.parentDatasetID;
  const parentDataset = null; // useDataset(parentId);
  const [activeTab, setActiveTab] = useState('joins');

  const [globalSearch, setGlobalSearch] = useState(false);

  useEffect(() => {
    const page = `${window.location.pathname}/${activeTab}`;
    window.fathom('trackPageview', { path: page });
  }, [activeTab]);

  useEffect(() => {
    window.fathom('trackPageview', { path: '/about' });
  }, []);

  // const mostSimilarDatasetsAway = similarDatasetsAway.filter(suggetsion);

  const renderNotFound = (currentDataset, parentData) => {
    if (parentData) {
      return (
        <p className="intro">
          This dataset is actually a view of dataset{' '}
          {parentData?.resource?.name}
        </p>
      );
    }
    if (currentDataset?.resource?.type === 'file') {
      return (
        <p className="intro">
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          This resource points of a file which we currently don't have the
          ability to analyse. We are working to bring more types of data to
          Scout. Check back shortly
        </p>
      );
    }
    if (currentDataset?.resource?.type === 'href') {
      return (
        <p className="intro">
          This resource is actually just a link to a website resource. We
          currently dont have the ability to provide information on such
          resources
        </p>
      );
    }
    return (
      <p className="intro">
        We currently dont have the ability to analyse this dataset.
      </p>
    );
  };

  const [
    ,
    {
      addToCurrentCollection,
      removeFromCurrentCollection,
      inCurrentCollection,
    },
  ] = useUserCollections();

  return (
    <div className="dataset-page" key={dataset ? dataset.id : 'unknown'}>
      <div className="dataset-details">
        <section>
          <Breadcrumb currentPage={dataset ? dataset.name : '...'} />
        </section>
        <section>
          <h2 className={dataset ? '' : 'animate'}>{dataset?.name}</h2>
          <p className={dataset ? '' : 'animate'}>
            {dataset?.informationAgency}
          </p>
          <RawHTML
            className={dataset ? '' : 'animate'}
            html={dataset?.description}
          />
          <button
            type="button"
            className="collection-button"
            disabled={!dataset}
            onClick={() =>
              inCurrentCollection(datasetID)
                ? removeFromCurrentCollection(datasetID)
                : addToCurrentCollection(datasetID)
            }
          >
            {inCurrentCollection(datasetID)
              ? 'Remove From Collection'
              : 'Add to Collection'}{' '}
          </button>
        </section>
        <section className="external-link">
          {dataset && (
            <>
              <p>Powered by</p>
              <img alt={dataset.portal.name} src={dataset.portal.logo} />
            </>
          )}
          <ViewOnOpenPortal permalink={dataset ? dataset?.permalink : '#'} />
        </section>
        <section className="metadata">
          <h2>Metadata</h2>
          <h3>Update Automation</h3>
          <p>{dataset?.updatedAutomation}</p>
          <h3>Update Frequency</h3>
          <p>{dataset?.updateFrequency}</p>
          <h3>Dataset Owner</h3>
          <p>{dataset?.owner}</p>
          {dataset?.informationAgency && (
            <>
              <h3>Agency</h3>
              <p>{dataset?.informationAgency}</p>
            </>
          )}
          {dataset?.category && (
            <>
              <h3>Category</h3>
              <p>{dataset?.domain_category}</p>
            </>
          )}
          <h3>Updated</h3>
          <p>{formatDate(dataset?.updatedAt)}</p>
          <h3>Metadata Updated at</h3>
          <p>{formatDate(dataset?.metaDataUpdatedAt)}</p>
          <h3>Page Views</h3>
          <p>{dataset?.views}</p>
        </section>
      </div>
      <div className="dataset-recomendataions">
        <div className="bar-and-toggle">
          <h2>Other datasets to consider</h2>
          {USE_SINGLE_CITY ? null : (
            <Switch
              checked={globalSearch}
              onChange={setGlobalSearch}
              checkedChildren="All portals"
              unCheckedChildren="Just this portal"
              style={{ background: '#009aa6' }}
            />
          )}
        </div>
        <div className="tabs">
          <button
            type="button"
            className={activeTab === 'joins' ? 'active' : ''}
            onClick={() => setActiveTab('joins')}
          >
            Potential Join Columns
          </button>
          <button
            type="button"
            className={activeTab === 'theme' ? 'active' : ''}
            onClick={() => setActiveTab('theme')}
          >
            Thematically Similar
          </button>
        </div>
        {activeTab === 'joins' &&
          (!dataset || dataset.datasetColumns.length > 0 ? (
            <>
              <p className="intro">
                Find datasets that share a column with the current dataset.
              </p>{' '}
              <p>
                {' '}
                These columns might be interesting datasets to join with the
                current dataset to add additional details or bring in context
              </p>
              <ColumnMatchTable global={globalSearch} dataset={dataset} />
            </>
          ) : (
            renderNotFound(dataset, parentDataset)
          ))}
        {activeTab === 'theme' && (
          <ThematicSimilarityExplorer
            global={globalSearch}
            datasetID={datasetID}
            portal={dataset.portal.id}
            dataset={dataset}
          />
        )}
      </div>
    </div>
  );
}
