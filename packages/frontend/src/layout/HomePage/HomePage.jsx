import numeral from 'numeral';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import './HomePage.scss';
import { DebounceInput } from 'react-debounce-input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
// import { gql, useQuery } from '@apollo/client';
import { Switch } from 'antd';
import { useSearchDatasets } from '../../hooks/graphQLAPI';
import {
  useSelectedColumns,
  useSelectedCategories,
  useSelectedDepartments,
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
import { useCollectionsValue } from '../../contexts/CollectionsContext';
import { GLOBAL_PORTAL_IDENTIFIER } from '../../portals';

// TODO: remove this when we've figured out how to combine elastic search with
// relational postgres search/sorting
const HIDE_SORT_MENU = true;

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

export default function HomePage({ portal, initialGlobalSearchVal }) {
  usePageView();
  const navigate = useNavigate();
  const prevPortal = usePrevious(portal);
  /*
  const [selectedTags] = useSelectedTags();
  */
  const [selectedDepartments, setSelectedDepartments] =
    useSelectedDepartments();
  const [selectedCategories, setSelectedCategories] = useSelectedCategories();
  const [selectedColumns, setSelectedColumns] = useSelectedColumns();
  const [searchTerm, setSearchTerm] = useSearchTerm();
  const [sortBy, setSortBy] = useSortVariable();
  const [sortDirection, setSortDirection] = useSortOrder();
  const datasetsPerPage = 40;
  const [currentPage, setCurrentPage] = useState(0);
  const [totalDatasets, setTotalDatasets] = useState(0);

  const [globalSearch, setGlobalSearch] = useState(initialGlobalSearchVal);
  const [globalState, dispatch] = useCollectionsValue();

  useEffect(() => {
    // if the portal has changed, clear the selected columns
    if (portal?.id !== prevPortal?.id) {
      setSelectedColumns([]);
      setSelectedCategories([]);
      setSelectedDepartments([]);
    }
  }, [
    portal?.id,
    prevPortal?.id,
    setSelectedColumns,
    setSelectedCategories,
    setSelectedDepartments,
  ]);

  const { loading, data, error } = useSearchDatasets(
    globalSearch ? null : portal?.id,
    {
      limit: datasetsPerPage,
      offset: datasetsPerPage * currentPage,
      search: searchTerm,
      datasetColumns: selectedColumns,
      categories: selectedCategories,
      departments: selectedDepartments,
    },
  );

  const datasets = loading || error ? [] : data.searchDatasets.datasets;

  const [pageNo, { pageButtons }] = usePagination({
    totalCount: totalDatasets,
    perPage: datasetsPerPage,
    invalidators: [searchTerm, portal?.socrataDomain],
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
            onChange={isOn => {
              setGlobalSearch(isOn);
              dispatch({
                type: 'PORTAL_SET_GLOBAL',
                payload: {
                  isGlobal: isOn,
                },
              });

              const portalAbbr = isOn
                ? GLOBAL_PORTAL_IDENTIFIER
                : globalState.activePortalAbbreviation;

              navigate(`/explore/${portalAbbr}`);
            }}
            checkedChildren="All portals"
            unCheckedChildren="Specific portal"
            style={{ margin: '0px 10px', background: '#009aa6' }}
          />
        </div>
        <div className="count-and-sort">
          <p>
            <span className="bold">{numeral(totalDatasets).format('0,0')}</span>{' '}
            datasets {searchTerm ? 'sorted by relevance' : ''}
          </p>

          {searchTerm || HIDE_SORT_MENU ? null : (
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
