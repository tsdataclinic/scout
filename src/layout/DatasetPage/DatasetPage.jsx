import React from 'react';
import moment from 'moment';
import RawHTML from '../../components/RawHTML/RawHTML';
import ColumnMatchTable from '../../components/ColumnMatchTable/ColumnMatchTable';
import { useDataset, useJoinableDatasets } from '../../hooks/datasets';
import './DatasetPage.scss';

const formatDate = (date) => moment(date).format('MMMM DD, YYYY');

export default function DatasetPage({ match }) {
  const { datasetID } = match.params;
  const dataset = useDataset(datasetID);
  const joins = useJoinableDatasets(dataset);

  console.log(dataset);

  const resource = dataset?.resource;
  const pageViews = resource?.page_views;
  const classification = dataset?.classification;
  const domainMetadata = classification?.domain_metadata;
  const updatedAutomation = domainMetadata?.find(
    ({ key, value }) => key === 'Update_Automation' && value === 'No',
  )?.value;

  const updateFrequency = domainMetadata?.find(
    ({ key }) => key === 'Update_Update-Frequency',
  )?.value;

  const informationAgency = domainMetadata?.find(
    ({ key }) => key === 'Dataset-Information_Agency',
  )?.value;
  console.log(dataset);
  return dataset ? (
    <div className="dataset-page">
      <div className="dataset-details">
        <section>
          <h2>{resource.name}</h2>
          <p>{informationAgency}</p>
          <RawHTML html={resource.description} />
        </section>
        <section className="external-link">
          <p>Powered by</p>
          <img
            alt="NYC Open Data"
            src="https://opendata.cityofnewyork.us/wp-content/themes/opendata-wp/assets/img/nyc-open-data-logo.svg"
          />
          <a target="_blank" rel="noopener noreferrer" href={dataset.permalink}>
            View on Open Data
          </a>
        </section>
        <section className="metadata">
          <h2>Metadata</h2>
          <h3>Update Automation</h3>
          <p>{updatedAutomation}</p>
          <h3>Update Frequency</h3>
          <p>{updateFrequency}</p>
          <h3>Dataset Owner</h3>
          <p>{dataset?.owner.display_name}</p>
          {informationAgency && (
            <>
              <h3>Agency</h3>
              <p>{informationAgency}</p>
            </>
          )}
          {classification?.domain_category && (
            <>
              <h3>Category</h3>
              <p>{classification.domain_category}</p>
            </>
          )}
          <h3>Updated</h3>
          <p>{formatDate(resource?.updatedAt)}</p>
          <h3>Metadata Updated at</h3>
          <p>{formatDate(resource?.metadata_updated_at)}</p>
          <h3>Page Views</h3>
          <p>{pageViews?.page_views_total}</p>
        </section>
      </div>
      <div className="dataset-recomendataions">
        <h2>Other datasets to consider</h2>
        <h3>Potential Join Columns</h3>
        <p>
          Find datasets that share a column with the current dataset. These
          columns might be interesting datasets to join with the current dataset
          to add additional details or bring in context
        </p>
        <ColumnMatchTable dataset={dataset} joinColumns={joins} />
      </div>
    </div>
  ) : (
    <h1>Loading...</h1>
  );
}
