import React, { useEffect, useState } from 'react';
import './HomePage.scss';
import { DebounceInput } from 'react-debounce-input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { gql, useQuery } from '@apollo/client';
import { useSearchDatasets } from '../../hooks/graphQLAPI';

import {
  useCategories,
  useTags,
  useDepartments,
  useDatasetsDB,
  useColumns,
  useStateLoaded,
} from '../../hooks/datasets';

import Dataset from '../../components/Dataset/Dataset';
import SortMenu from '../../components/SortMenu/SortMenu';
import DatasetsLoading from '../../components/Loading/DatasetsLoading/DatasetsLoading';
import { usePagination } from '../../hooks/pagination';
import usePageView from '../../hooks/analytics';
import PortalSelector from '../../components/PortalSelector/PortalSelector';
import Filters from '../../components/Filters/Filters';

import {
  useSelectedCategories,
  useSelectedTags,
  useSelectedDepartments,
  useSelectedColumns,
  useSearchTerm,
  useSortVariable,
  useSortOrder,
  useFilterBarState,
} from '../../hooks/search';

const ALL_DATASETS_PAGED = gql`
  query Query($limit: Int, $offset: Int) {
    datasets(limit: $limit, offset: $offset) {
      name
      description
    }
  }
`;
export default function HomePage({ portal }) {
  usePageView();

  const [selectedTags] = useSelectedTags();
  const [selectedColumns] = useSelectedColumns();
  const [selectedCategories] = useSelectedCategories();
  const [selectedDepartments] = useSelectedDepartments();

  const [searchTerm, setSearchTerm] = useSearchTerm();
  const [sortBy, setSortBy] = useSortVariable();
  const [sortDirection, setSortDirection] = useSortOrder();
  const datasetsPerPage = 40;
  const [currentPage, setCurrentPage] = useState(0);
  const [totalDatasets, setTotalDatasets] = useState(0);

  const { loading, data, error } = useSearchDatasets(portal.id, {
    limit: datasetsPerPage,
    offset: datasetsPerPage * currentPage,
    search: searchTerm,
  });

  const datasets = loading || error ? [] : data.searchDatasets.datasets;

  const [pageNo, { pageButtons }] = usePagination({
    totalCount: totalDatasets,
    perPage: datasetsPerPage,
    invaidators: [searchTerm, portal.socrataDomain],
  });

  useEffect(() => {
    console.log('upading page number ', pageNo);
    setCurrentPage(pageNo);
  }, [pageNo]);

  useEffect(() => {
    if (!loading && data) {
      setTotalDatasets(data.searchDatasets.total);
    }
  }, [loading, data]);
  const [collapseFilterBar, setCollapseFilterBar] = useFilterBarState();

  return (
    <div className="home-page">
      <Filters
        onCollapseFilterBar={setCollapseFilterBar}
        collapsed={collapseFilterBar}
        portal={portal}
      />
      <div className="datasets">
        <div className="selector-and-search">
          <PortalSelector selectedPortal={portal} />

          <div className="search">
            <FontAwesomeIcon size="lg" icon={faSearch} />
            <DebounceInput
              type="text"
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
              debounceTimeout={1000}
              placeholder="Search for dataset"
            />
          </div>
        </div>
        <div className="count-and-sort">
          <p>
            <span className="bold">{totalDatasets}</span> datasets{' '}
            {searchTerm ? 'sorted by relevance' : ''}
          </p>

          {searchTerm ? null : (
            <SortMenu
              options={[
                'Name',
                'Created At',
                'Updated At',
                'Downloads',
                'Views',
              ]}
              onDirection={(direction) => setSortDirection(direction)}
              selected={sortBy}
              direction={sortDirection}
              onSelected={(selected) => setSortBy(selected)}
            />
          )}
        </div>

        <ul className="dataset-list">
          {!loading ? (
            datasets.map((dataset) => (
              <Dataset key={dataset?.id} dataset={dataset} query={searchTerm} />
            ))
          ) : (
            <DatasetsLoading />
          )}
        </ul>
        <div>{pageButtons}</div>
      </div>
    </div>
  );
}
