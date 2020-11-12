import { useQuery, gql, useMutation } from '@apollo/client';

export const useCategoriesGQL = (portal, limit, page) => {
  return [];
};

export const useDepartmentsGQL = (portal, limit, page) => {
  return [];
};

export const useDatasetsFromIds = (ids) => {
  const DatasetsFromIdsQuery = gql`
    query GetDatasetsByIds($ids: [String!]!) {
      datasetsByIds(ids: $ids) {
        name
        description
        department
        id
      }
    }
  `;

  return useQuery(DatasetsFromIdsQuery, { variables: { ids } });
};

export const useCollection = (id) => {
  const CollectionQuery = gql`
    query getCollection($id: String!) {
      collection(id: $id) {
        name
        description
        id
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
  return useQuery(CollectionQuery, { variables: { id: id ? id : '' } });
};

export const useSearchDatasets = (
  portal,
  {
    search,
    columns,
    departments,
    categories,
    tags,
    limit,
    offset,
    sortCol,
    sortDir,
  },
) => {
  const SearchPortalQuery = gql`
    query SearchPortalDatasets(
      $portal: String
      $limit: Float
      $offset: Float
      $search: String
    ) {
      searchDatasets(
        portal: $portal
        limit: $limit
        offset: $offset
        search: $search
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
          permalink
          department
        }
        total
      }
    }
  `;

  return useQuery(SearchPortalQuery, {
    variables: { portal, limit, offset, search },
  });
};

export const usePortals = () => {
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
  const LoginAttempt = gql`
    mutation SignIn($email: String!, $password: String!) {
      signIn(email: $email, password: $password) {
        token
        error
      }
    }
  `;

  const variables = { email, password };
  return useMutation(LoginAttempt);
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

  const variables = { email, password, username };
  return useMutation(SignUpAttempt);
};

export const useCurrentUser = () => {
  const CurrentUser = gql`
    query Profile {
      profile {
        email
        id
        username
      }
    }
  `;
  return useQuery(CurrentUser);
};

export const useCurrentUserCollections = () => {
  const CurrentUserAndCollections = gql`
    query Profile {
      profile {
        email
        id
        username
        collections {
          id
          name
          description
          datasets {
            id
            name
            description
            department
          }
        }
      }
    }
  `;
  return useQuery(CurrentUserAndCollections);
};

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
  return useMutation(CreateCollection);
};

export const useDatasetColumnsWithSuggestionCounts = (id, global) => {
  const Query = gql`
    query DatasetColumnWithSuggestions($id: Int!, $global: Boolean!) {
      datasetColumn(id: $id) {
        name
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

export const useDatasetGQL = (datasetId) => {
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
        datasetColumns {
          name
          type
          id
        }
        portal {
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
export const useColumnsGQL = (portal, { limit, page, search }) => {
  // TODO - Figure out why Float works here but Int does not
  const getColumnsQuery = gql`
    query Columns(
      $portal: String!
      $limit: Float
      $offset: Float
      $search: String
    ) {
      portal(id: $portal) {
        uniqueColumnFields(limit: $limit, offset: $offset, search: $search) {
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
    portal: 'data.ny.gov',
    limit,
    offset: limit * page,
    search,
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
  console.log({ id: columnID, global, limit, offset });
  return useQuery(query, {
    variables: { id: columnID, global, limit, offset },
  });
};

export const useSimilarDatasets = (datasetId) => {
  const getSimilarQuery = gql`
    query SimilarDatasets($datasetId: String!) {
      dataset(id: $datasetId) {
        thematicallySimilarDatasets {
          dataset {
            name
            portal {
              name
              id
              adminLevel
              abbreviation
            }
            description
            id
          }
          score
        }
      }
    }
  `;
  return useQuery(getSimilarQuery, { variables: { datasetId } });
};

export const useTagsGQL = (portal) => {
  return [];
};
