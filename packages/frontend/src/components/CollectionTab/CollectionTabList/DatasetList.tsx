import { useState } from 'react';
import { useQuery, gql, QueryResult } from '@apollo/client';
import { Link } from 'react-router-dom';
import { Collection } from './types';
import getDatasetURL from '../../../utils/getDatasetURL';
import { useUserCollections } from '../../../hooks/collections';

type Dataset = {
  id: string;
  name: string;
  department: string;
  portal: {
    abbreviation: string;
  };
};

type Props = {
  collection: Collection;
};

const GET_DATASETS_QUERY = gql`
  query GetDatasetsByIds($ids: [String!]!) {
    datasetsByIds(ids: $ids) {
      id
      name
      department
      portal {
        abbreviation
      }
    }
  }
`;

function useDatasets(ids: string[]): QueryResult<{
  datasetsByIds: Dataset[];
}> {
  return useQuery(GET_DATASETS_QUERY, { variables: { ids } });
}

export default function DatasetList({ collection }: Props): JSX.Element {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore TODO: remove this when useUserCollections is type-annotated
  const [, { removeFromCurrentCollection }] = useUserCollections();
  const [datasetIds, setDatasetIds] = useState<string[]>(collection.datasetIds);
  const datasets = useDatasets(datasetIds).data?.datasetsByIds || [];

  return (
    <ul>
      {datasets.map(dataset => (
        <li key={dataset.id} className="collection-tab-dataset">
          <div>
            <p>
              <Link to={getDatasetURL(dataset)}>
                <span className="name">{dataset.name}</span>
              </Link>
            </p>
            <p className="agency">{dataset.department}</p>
          </div>
          <button
            type="button"
            onClick={async () => {
              // TODO: $ATC remove collection optimistically?
              // TODO: $ATC use the return value here to reset the collection
              // and also refresh the useDatasets query
              const newCollection: {
                description: string;
                id: string;
                name: string;
                datasets: Array<{ id: string }>;
              } = await removeFromCurrentCollection(dataset.id, collection.id);
              setDatasetIds(newCollection.datasets.map(d => d.id));
            }}
          >
            Remove
          </button>
        </li>
      ))}
    </ul>
  );
}
