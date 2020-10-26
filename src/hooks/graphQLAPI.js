import { useQuery, gql } from '@apollo/client';
import { useEffect } from 'react';
import usePagination from './pagination';

export const useCategoriesGQL = (portal, limit, page) => {
  return [];
};

export const useDepartmentsGQL = (portal, limit, page) => {
  return [];
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

export const useDatasetGQL = (datasetId) => {
  const DatasetQuery = gql`
    query Dataset($datasetId: String!) {
      dataset(id: $datasetId) {
        name
        department
        description
        views
        updatedAt
        createdAt
        permalink
        portal {
          name
          baseURL
          logo
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

export const useSimilarDatasets = (datasetId) => {
  const getSimilarQuery = gql`
    query SimilarDatasets($datasetId: String!) {
      dataset(id: $datasetId) {
        thematicallySimilarDatasets {
          name
          portal {
            name
            id
            adminLevel
          }
          description
          id
        }
      }
    }
  `;
  return useQuery(getSimilarQuery, { variables: { datasetId } });
};

export const useTagsGQL = (portal) => {
  return [];
};
