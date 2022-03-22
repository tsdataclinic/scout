import { useQuery, gql, useMutation } from '@apollo/client';

export const useDatasetsFromIds = ids => {
  const DatasetsFromIdsQuery = gql`
    query GetDatasetsByIds($ids: [String!]!) {
      datasetsByIds(ids: $ids) {
        id
        name
        department
        description
        views
        updatedAt
        createdAt
        permalink
        updateFrequency
        portal {
          id
          name
          adminLevel
          abbreviation
        }
      }
    }
  `;

  return useQuery(DatasetsFromIdsQuery, { variables: { ids } });
};

export const useCollection = id => {
  const CollectionQuery = gql`
    query getCollection($id: String!) {
      collection(id: $id) {
        name
        description
        id
        createdAt
        datasets {
          name
          description
          department
          id
          portal {
            name
            id
            adminLevel
          }
        }
      }
    }
  `;
  return useQuery(CollectionQuery, { variables: { id: id || '' } });
};

export const useSearchDatasets = (
  portal,
  { search, limit, offset, datasetColumns, categories, departments },
) => {
  const SearchPortalQuery = gql`
    query SearchPortalDatasets(
      $portal: String
      $limit: Float
      $offset: Float
      $search: String
      $datasetColumns: [String!]
      $categories: [String!]
      $departments: [String!]
    ) {
      searchDatasets(
        portal: $portal
        limit: $limit
        offset: $offset
        search: $search
        datasetColumns: $datasetColumns
        categories: $categories
        departments: $departments
      ) {
        datasets {
          portal {
            name
            adminLevel
            abbreviation
          }
          id
          name
          description
          updateFrequency
          updatedAt
          permalink
          department
        }
        total
      }
    }
  `;

  return useQuery(SearchPortalQuery, {
    variables: {
      portal,
      limit,
      offset,
      search,
      datasetColumns,
      categories,
      departments,
    },
  });
};

export const usePortals = () => {
  console.log('Loading all portals');
  const PortalListQuery = gql`
    query PortalList {
      portals {
        name
        abbreviation
        id
        adminLevel
      }
    }
  `;
  return useQuery(PortalListQuery);
};

export const useAttemptLogin = (email, password) => {
  console.log('Attemping login');

  const LoginAttempt = gql`
    mutation SignIn($email: String!, $password: String!) {
      signIn(email: $email, password: $password) {
        token
        error
      }
    }
  `;

  return useMutation(LoginAttempt, { email, password });
};

export const useAttemptSignUp = (email, password, username) => {
  const SignUpAttempt = gql`
    mutation SignUp($email: String!, $password: String!, $username: String!) {
      signUp(email: $email, password: $password, username: $username) {
        success
        error
        token
      }
    }
  `;

  return useMutation(SignUpAttempt, { email, password, username });
};

export const useCurrentUser = () => {
  const CurrentUser = gql`
    query Profile {
      profile {
        id
      }
    }
  `;
  return useQuery(CurrentUser);
};

const GET_ALL_CURRENT_USER_COLLECTIONS = gql`
  query Profile {
    profile {
      id
      collections {
        id
        name
        description
        datasets {
          id
        }
      }
    }
  }
`;

export function useCurrentUserCollections() {
  return useQuery(GET_ALL_CURRENT_USER_COLLECTIONS);
}

export const useCreateCollection = () => {
  const CreateCollection = gql`
    mutation CreateCollection(
      $name: String!
      $description: String!
      $datasetIds: [String!]!
    ) {
      createCollection(
        name: $name
        description: $description
        datasetIds: $datasetIds
      ) {
        name
        description
        id
      }
    }
  `;
  return useMutation(CreateCollection, {
    refetchQueries: [{ query: GET_ALL_CURRENT_USER_COLLECTIONS }],
  });
};

export const useDeleteCollection = () => {
  const DeleteCollection = gql`
    mutation DeleteCollection($id: String!) {
      deleteCollection(id: $id) {
        id
      }
    }
  `;
  return useMutation(DeleteCollection, {
    refetchQueries: [{ query: GET_ALL_CURRENT_USER_COLLECTIONS }],
  });
};

export const useDatasetColumnsWithSuggestionCounts = (id, global) => {
  const Query = gql`
    query DatasetColumnWithSuggestions($id: Int!, $global: Boolean!) {
      datasetColumn(id: $id) {
        name
        field
        type
        id
        joinSuggestionCount(global: $global)
      }
    }
  `;
  return useQuery(Query, { variables: { id, global } });
};

export const useAddToCollection = () => {
  const mut = gql`
    mutation addToCollection($id: String!, $datasetIds: [String!]!) {
      addToCollection(id: $id, datasetIds: $datasetIds) {
        id
        datasets {
          id
          name
          description
        }
        name
        description
      }
    }
  `;
  return useMutation(mut);
};

export function useRemoveDatasetFromCollection() {
  const removeDatasetFromCollectionMutation = gql`
    mutation removeDatasetFromCollection(
      $collectionId: String!
      $datasetId: String!
    ) {
      removeDatasetFromCollection(
        collectionId: $collectionId
        datasetId: $datasetId
      ) {
        id
        name
        description
        datasets {
          id
          name
          description
        }
      }
    }
  `;
  return useMutation(removeDatasetFromCollectionMutation);
}

export const useDatasetGQL = datasetId => {
  const DatasetQuery = gql`
    query Dataset($datasetId: String!) {
      dataset(id: $datasetId) {
        id
        name
        department
        description
        views
        updatedAt
        createdAt
        permalink
        updateFrequency
        datasetColumns {
          name
          type
          id
        }
        portal {
          id
          name
          baseURL
          logo
          abbreviation
        }
      }
    }
  `;
  return useQuery(DatasetQuery, { variables: { datasetId } });
};

export function useCategoriesGQL(portal, { limit, page, search, isGlobal }) {
  // TODO - Figure out why Float works here but Int does not
  const getCategoriesQuery = gql`
    query Categories(
      $portal: String!
      $limit: Float
      $offset: Float
      $search: String
      $isGlobal: Boolean
    ) {
      portal(id: $portal) {
        uniqueCategories(
          limit: $limit
          offset: $offset
          search: $search
          isGlobal: $isGlobal
        ) {
          items {
            category
            occurrences
          }
          total
        }
      }
    }
  `;

  const variables = {
    portal,
    limit,
    offset: limit * page,
    search,
    isGlobal,
  };

  return useQuery(getCategoriesQuery, {
    variables,
  });
}

export function useDepartmentsGQL(portal, { limit, page, search, isGlobal }) {
  // TODO - Figure out why Float works here but Int does not
  const GET_DEPARTMENTS_QUERY = gql`
    query Departments(
      $portal: String!
      $limit: Float
      $offset: Float
      $search: String
      $isGlobal: Boolean
    ) {
      portal(id: $portal) {
        uniqueDepartments(
          limit: $limit
          offset: $offset
          search: $search
          isGlobal: $isGlobal
        ) {
          items {
            department
            occurrences
          }
          total
        }
      }
    }
  `;

  const variables = {
    isGlobal,
    portal,
    limit,
    offset: limit * page,
    search,
  };

  return useQuery(GET_DEPARTMENTS_QUERY, {
    variables,
  });
}

export const useColumnsGQL = (portal, { limit, page, search, isGlobal }) => {
  // TODO - Figure out why Float works here but Int does not
  const getColumnsQuery = gql`
    query Columns(
      $portal: String!
      $limit: Float
      $offset: Float
      $search: String
      $isGlobal: Boolean
    ) {
      portal(id: $portal) {
        uniqueColumnFields(
          limit: $limit
          offset: $offset
          search: $search
          isGlobal: $isGlobal
        ) {
          items {
            field
            occurrences
          }
          total
        }
      }
    }
  `;

  const variables = {
    portal,
    limit,
    offset: limit * page,
    search,
    isGlobal,
  };

  return useQuery(getColumnsQuery, {
    variables,
  });
};

export const useJoinableDatasetsPaged = (columnID, global, limit, offset) => {
  const query = gql`
    query ColumnJoins($id: Int!, $global: Boolean!, $limit: Int, $offset: Int) {
      datasetColumn(id: $id) {
        joinSuggestions(global: $global, limit: $limit, offset: $offset) {
          potentialOverlap
          column {
            field
            dataset {
              name
              id
              portal {
                id
                name
                abbreviation
                adminLevel
              }
            }
          }
        }
      }
    }
  `;
  return useQuery(query, {
    variables: { id: columnID, global, limit, offset },
  });
};

export const useSimilarDatasets = (datasetId, portal) => {
  const getSimilarQuery = gql`
    query SimilarDatasets($datasetId: String!, $portalId: String) {
      dataset(id: $datasetId) {
        thematicallySimilarDatasets(portalId: $portalId) {
          dataset {
            id
            name
            description
            updateFrequency
            updatedAt
            portal {
              name
              id
              adminLevel
              abbreviation
            }
          }
          score
        }
      }
    }
  `;
  return useQuery(getSimilarQuery, {
    variables: { datasetId, portalId: portal },
  });
};

export const useTagsGQL = () => [];
