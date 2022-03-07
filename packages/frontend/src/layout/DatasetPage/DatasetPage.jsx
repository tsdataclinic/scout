import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import ResourcesExplorer from './ResourcesExplorer';

const formatDate = date => moment(date).format('MMMM DD, YYYY');

export default function DatasetPage() {
  usePageView();
  const navigate = useNavigate();
  const { datasetId, tab } = useParams();
  const { loading, error, data } = useDatasetGQL(datasetId);
  const dataset = loading || error ? null : data.dataset;

  // const parentId = dataset?.parentDatasetID;
  const parentDataset = null; // useDataset(parentId);
  const [activeTab, setActiveTab] = useState(tab || 'joins');

  const [globalSearch, setGlobalSearch] = useState(false);

  const onChangeTab = newTab => {
    // only switch if it's going to be a new tab
    if (newTab !== activeTab) {
      const currURL = window.location.pathname;
      // drop the last part of the path
      const urlParts = currURL.split('/').slice(0, -1).join('/');
      navigate(`${urlParts}/${newTab}`);
      setActiveTab(newTab);
    }
  };

  useEffect(() => {
    if (tab === undefined) {
      navigate('joins');
    }
  }, [tab, navigate]);

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
          This resource points of a file which we currently don&apos;t have the
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
              inCurrentCollection(datasetId)
                ? removeFromCurrentCollection(datasetId)
                : addToCurrentCollection(datasetId)
            }
          >
            {inCurrentCollection(datasetId)
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
          {/* TODO: fix this. Right now a `null` value represents Yes,
            and `false` is No. This is weird. */}
          <p>{dataset?.updatedAutomation === null ? 'Yes' : 'No'}</p>
          <h3>Update Frequency</h3>
          <p>{dataset?.updateFrequency}</p>
          {dataset?.department && (
            <>
              <h3>Agency</h3>
              <p>{dataset?.department}</p>
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
          <Switch
            checked={globalSearch}
            onChange={setGlobalSearch}
            checkedChildren="All portals"
            unCheckedChildren="Just this portal"
            style={{ background: '#009aa6' }}
          />
        </div>
        <div className="tabs">
          <button
            type="button"
            className={activeTab === 'joins' ? 'active' : ''}
            onClick={() => onChangeTab('joins')}
          >
            Potential Join Columns
          </button>
          <button
            type="button"
            className={activeTab === 'theme' ? 'active' : ''}
            onClick={() => onChangeTab('theme')}
          >
            Thematically Similar
          </button>
          <button
            type="button"
            className={activeTab === 'resources' ? 'active' : ''}
            onClick={() => onChangeTab('resources')}
          >
            Resources
          </button>
        </div>
        {activeTab === 'joins' &&
          (!dataset || dataset.datasetColumns.length > 0 ? (
            <>
              <p className="intro">
                Find datasets that share a column with the current dataset.
              </p>
              <p>
                These columns might be interesting datasets to join with the
                current dataset to add additional details or bring in context
              </p>
              <ColumnMatchTable global={globalSearch} dataset={dataset} />
            </>
          ) : (
            renderNotFound(dataset, parentDataset)
          ))}
        {activeTab === 'theme' && dataset ? (
          <ThematicSimilarityExplorer
            global={globalSearch}
            datasetId={datasetId}
            portal={dataset.portal.id}
            dataset={dataset}
          />
        ) : null}
        {activeTab === 'resources' && (
          <ResourcesExplorer datasetId={datasetId} />
        )}
      </div>
    </div>
  );
}
