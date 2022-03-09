import { useEffect, useState } from 'react';
import './HomePage.scss';
import { DebounceInput } from 'react-debounce-input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
// import { gql, useQuery } from '@apollo/client';
import { Switch } from 'antd';
import { useSearchDatasets } from '../../hooks/graphQLAPI';
import {
  useSelectedColumns,
  useSearchTerm,
  useSortVariable,
  useSortOrder,
  useFilterBarState,
} from '../../hooks/search';
import Dataset from '../../components/Dataset/Dataset';
import SortMenu from '../../components/SortMenu/SortMenu';
import DatasetsLoading from '../../components/Loading/DatasetsLoading/DatasetsLoading';
import { usePagination } from '../../hooks/pagination';
import usePageView from '../../hooks/analytics';
import PortalSelector from '../../components/PortalSelector/PortalSelector';
import Filters from '../../components/Filters/Filters';

/*
const ALL_DATASETS_PAGED = gql`
  query Query($limit: Int, $offset: Int) {
    datasets(limit: $limit, offset: $offset) {
      name
      description
    }
  }
`;
*/

export default function HomePage({ portal }) {
  usePageView();
  /*
  const [selectedTags] = useSelectedTags();
  const [selectedCategories] = useSelectedCategories();
  const [selectedDepartments] = useSelectedDepartments();
  */
  const [selectedColumns] = useSelectedColumns();
  console.log('Selected columns', selectedColumns);

  const [searchTerm, setSearchTerm] = useSearchTerm();
  const [sortBy, setSortBy] = useSortVariable();
  const [sortDirection, setSortDirection] = useSortOrder();
  const datasetsPerPage = 40;
  const [currentPage, setCurrentPage] = useState(0);
  const [totalDatasets, setTotalDatasets] = useState(0);

  const [globalSearch, setGlobalSearch] = useState(false);

  const { loading, data, error } = useSearchDatasets(
    globalSearch ? null : portal.id,
    {
      limit: datasetsPerPage,
      offset: datasetsPerPage * currentPage,
      search: searchTerm,
    },
  );

  const datasets = loading || error ? [] : data.searchDatasets.datasets;

  const [pageNo, { pageButtons }] = usePagination({
    totalCount: totalDatasets,
    perPage: datasetsPerPage,
    invalidators: [searchTerm, portal.socrataDomain],
  });

  useEffect(() => {
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
        globalSearch={globalSearch}
      />
      <div className="datasets">
        <div className="selector-and-search">
          {!globalSearch ? <PortalSelector selectedPortal={portal} /> : null}

          <div className="search">
            <FontAwesomeIcon size="lg" icon={faSearch} />
            <DebounceInput
              type="text"
              onChange={e => setSearchTerm(e.target.value)}
              value={searchTerm}
              debounceTimeout={1000}
              placeholder="Search for dataset"
            />
          </div>

          <Switch
            checked={globalSearch}
            onChange={setGlobalSearch}
            checkedChildren="All portals"
            unCheckedChildren="Specific portal"
            style={{ margin: '0px 10px', background: '#009aa6' }}
          />
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
              onDirection={direction => setSortDirection(direction)}
              selected={sortBy}
              direction={sortDirection}
              onSelected={selected => setSortBy(selected)}
            />
          )}
        </div>

        <ul className="dataset-list">
          {loading ? (
            <DatasetsLoading />
          ) : (
            datasets.map(dataset => (
              <Dataset
                key={dataset?.id}
                showStats={false}
                dataset={dataset}
                query={searchTerm}
              />
            ))
          )}
        </ul>
        <div>{pageButtons}</div>
      </div>
    </div>
  );
}
