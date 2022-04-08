import { useQuery, gql, QueryResult } from '@apollo/client';
import { Collection } from './types';
import getDatasetURL from '../../../utils/getDatasetURL';
import { useUserCollections } from '../../../hooks/collections';
import UnderlinedLink from './UnderlinedLink';
import EmptyPanelContent from './EmptyPanelContent';

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
  const [, { removeFromCollection }] = useUserCollections();
  const datasets = useDatasets(collection.datasetIds).data?.datasetsByIds || [];

  if (datasets.length === 0) {
    return (
      <EmptyPanelContent>
        No datasets have been added to this dataset.
      </EmptyPanelContent>
    );
  }

  return (
    <ul>
      {datasets.map(dataset => (
        <li key={dataset.id} className="collection-tab-dataset">
          <div>
            <p>
              <UnderlinedLink to={getDatasetURL(dataset)}>
                {dataset.name}
              </UnderlinedLink>
            </p>
            <p className="agency">{dataset.department}</p>
          </div>
          <button
            type="button"
            onClick={async () => {
              removeFromCollection(dataset.id, collection.id);
            }}
          >
            Remove
          </button>
        </li>
      ))}
    </ul>
  );
}
