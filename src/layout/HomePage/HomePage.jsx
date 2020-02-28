import React from 'react';
import './HomePage.scss';
import { DebounceInput } from 'react-debounce-input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleLeft,
  faAngleDown,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import {
  useCategories,
  useTags,
  useDepartments,
  useDatasets,
  useColumns,
  useStateLoaded,
  useSortDatsetsBy,
} from '../../hooks/datasets';
import { useCurrentCollection } from '../../hooks/collections';
import Dataset from '../../components/Dataset/Dataset';
import SortMenu from '../../components/SortMenu/SortMenu';
import DatasetLoading from '../../components/Loading/DatasetLoading/DatasetLoading';
import usePagination from '../../hooks/pagination';
import MultiSelector from '../../components/MultiSelector/MultiSelector';
import {
  useSelectedCategories,
  useSelectedTags,
  useSelectedDepartments,
  useSelectedColumns,
  useSearchTerm,
  useSortVariable,
  useSortOrder,
  useFilterBarState,
  useFilterUIStates,
} from '../../hooks/search';

export default function HomePage() {
  const categories = useCategories();
  const tags = useTags();
  const departments = useDepartments();
  const columns = useColumns();
  const loaded = useStateLoaded();
  //    const [colpaseFilters, setCollapseFilters] = useState(true);

  const [selectedTags, setSelectedTags] = useSelectedTags();
  const [selectedColumns, setSelectedColumns] = useSelectedColumns();
  const [selectedCategories, setSelectedCategories] = useSelectedCategories();
  const [
    selectedDepartments,
    setSelectedDepartments,
  ] = useSelectedDepartments();
  const [searchTerm, setSearchTerm] = useSearchTerm();
  const [sortBy, setSortBy] = useSortVariable();
  const [sortDirection, setSortDirection] = useSortOrder();

  const [
    collection,
    { addToCollection, removeFromCollection },
  ] = useCurrentCollection();

  const { datasets } = useDatasets({
    tags: selectedTags,
    categories: selectedCategories,
    columns: selectedColumns,
    term: searchTerm,
    departments: selectedDepartments,
  });

  const [collapseFilterBar, setCollapseFilterBar] = useFilterBarState();
  const [filterStates, setFilterState] = useFilterUIStates();

  const sortedDatasets = useSortDatsetsBy(
    datasets,
    sortBy,
    sortDirection === 'asc',
    searchTerm,
  );

  const [pagedDatasets, { pageButtons }] = usePagination(sortedDatasets, 5);

  return (
    <div className="home-page">
      <div className={`filters ${collapseFilterBar ? 'collapsed' : ''}`}>
        {!collapseFilterBar ? (
          <>
            <h2 className="filter-header">
              <button
                onKeyDown={() => setCollapseFilterBar(true)}
                onClick={() => setCollapseFilterBar(true)}
                className="header-button"
                type="button"
              >
                Filters <FontAwesomeIcon icon={faAngleLeft} />
              </button>
            </h2>
            <div className="filters-scroll-area">
              <div className="categories">
                <MultiSelector
                  items={categories}
                  onChange={setSelectedCategories}
                  selected={selectedCategories}
                  collapse={filterStates.categories}
                  onCollapse={(collapsed) =>
                    setFilterState('categories', collapsed)
                  }
                  title="Categories"
                />
              </div>
              <div className="departments">
                <MultiSelector
                  items={departments}
                  selected={selectedDepartments}
                  onChange={setSelectedDepartments}
                  collapse={filterStates.departments}
                  onCollapse={(collapsed) =>
                    setFilterState('departments', collapsed)
                  }
                  title="Departments"
                />
              </div>
              <div className="columns">
                <MultiSelector
                  items={columns}
                  selected={selectedColumns}
                  onChange={setSelectedColumns}
                  collapse={filterStates.columns}
                  onCollapse={(collapsed) =>
                    setFilterState('columns', collapsed)
                  }
                  title="Columns"
                />
              </div>
              <div className="tags">
                <MultiSelector
                  items={tags}
                  selected={selectedTags}
                  onChange={setSelectedTags}
                  collapse={filterStates.tags}
                  onCollapse={(collapsed) => setFilterState('tags', collapsed)}
                  title="Tags"
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <h2>
              <button
                onKeyDown={() => setCollapseFilterBar(false)}
                onClick={() => setCollapseFilterBar(false)}
                className="header-button"
                type="button"
              >
                Filters
                <FontAwesomeIcon icon={faAngleDown} />
              </button>
            </h2>
          </>
        )}
      </div>
      <div className="datasets">
        <div className="search">
          <FontAwesomeIcon size="lg" icon={faSearch} />
          <DebounceInput
            type="text"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
            debounceTimeout={300}
            placeholder="Search for dataset"
          />
        </div>
        <div className="count-and-sort">
          <p>
            <span className="bold">{datasets.length}</span> datasets{' '}
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
          {loaded ? (
            pagedDatasets.map((dataset) => (
              <Dataset
                key={dataset?.resource?.id}
                dataset={dataset}
                inCollection={collection.datasets.includes(dataset.resource.id)}
                onAddToCollection={(datasetID) =>
                  addToCollection(collection.id, datasetID)
                }
                onRemoveFromCollection={(datasetID) =>
                  removeFromCollection(collection.id, datasetID)
                }
                query={searchTerm}
              />
            ))
          ) : (
            <DatasetLoading />
          )}
        </ul>
        <div>{pageButtons}</div>
      </div>
    </div>
  );
}
