import React from 'react';
import { Link } from 'react-router-dom';
import { useDataset, useJoinableDatasets } from '../hooks/datasets';

const ComparisonPage = ({ match }) => {
  const { datasetID } = match.params;
  const dataset = useDataset(datasetID);
  const joins = useJoinableDatasets(dataset);
  return (
    <div className="dataset-page">
      {dataset ? (
        <>
          <div className="dataset-header">
            <h1>Dataset {dataset.resource.name}</h1>
            <p>{dataset.resource.description}</p>
          </div>
          <div className="dataset-columns">
            <h2>Columns</h2>
            <ul className="columns-list">
              {dataset.resource.columns_name.map((name, index) => (
                <li>
                  {name} : {dataset.resource.columns_datatype[index]}
                </li>
              ))}
            </ul>
          </div>
          <div className="dataset-joins">
            <h2>Can be joined with</h2>
            <ul style={{ overflowY: 'auto' }}>
              {joins.map(j => (
                <li>
                  <p>
                    <Link to={`/dataset/${j.dataset.resource.id}`}>
                      {j.dataset.resource.name}{' '}
                    </Link>{' '}
                    on :
                  </p>
                  <p> {j.joinableColumns.join(', ')}</p>
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <h1>Loading...</h1>
      )}
    </div>
  );
};

export default ComparisonPage;
