/* eslint-disable no-unused-vars */
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import MultiSelector from '../MultiSelector/MultiSelector';

import {
  useFilterUIStates,
  useSelectedCategories,
  useSelectedTags,
  useSelectedDepartments,
  useSelectedColumns,
} from '../../hooks/search';

import {
  useCategoriesGQL,
  useColumnsGQL,
  useTagsGQL,
  useDepartmentsGQL,
} from '../../hooks/graphQLAPI';

export default function Filters({ collapsed, onCollapseFilterBar, portal }) {
  const [filterStates, setFilterState] = useFilterUIStates();

  const [selectedCategories, setSelectedCategories] = useSelectedCategories();
  const [selectedTags, setSelectedTags] = useSelectedTags();
  const [selectedColumns, setSelectedColumns] = useSelectedColumns(
    'data.cityofnewyork.us',
  );
  const [selectedDepartments, setSelectedDepartments] =
    useSelectedDepartments();

  return (
    <div className={`filters ${collapsed ? 'collapsed' : ''}`}>
      {!collapsed ? (
        <>
          <h2 className="filter-header">
            <button
              onKeyDown={() => onCollapseFilterBar(true)}
              onClick={() => onCollapseFilterBar(true)}
              className="header-button"
              type="button"
            >
              Filters <FontAwesomeIcon icon={faAngleLeft} />
            </button>
          </h2>
          <div className="filters-scroll-area">
            {/* <div className="categories">
              <MultiSelector
                itemFetcher={useCategoriesGQL}
                selectedHook={useSelectedCategories}
                collapse={filterStates.categories}
                onCollapse={(collapsed) =>
                  setFilterState('categories', collapsed)
                }
                title="Categories"
              />
            </div>
            <div className="departments">
              <MultiSelector
                itemFetcher={useDepartmentsGQL}
                selectedHook={useSelectedDepartments}
                collapse={filterStates.departments}
                onCollapse={(collapsed) =>
                  setFilterState('departments', collapsed)
                }
                title="Departments"
              />
            </div> */}
            <div className="columns">
              <MultiSelector
                itemFetcher={useColumnsGQL}
                selectedHook={useSelectedColumns}
                collapse={filterStates.columns}
                onCollapse={_collapsed => setFilterState('columns', _collapsed)}
                title="Columns"
                key="Columns"
              />
            </div>
            {/* <div className="tags">
              <MultiSelector
                itemFetcher={useTagsGQL}
                selectedHook ={useSelectedTags}
                collapse={filterStates.tags}
                onCollapse={(collapsed) => setFilterState('tags', collapsed)}
                title="Tags"
              />
            </div> */}
          </div>
        </>
      ) : (
        <h2>
          <button
            onKeyDown={() => onCollapseFilterBar(false)}
            onClick={() => onCollapseFilterBar(false)}
            className="header-button"
            type="button"
          >
            Filters
            <FontAwesomeIcon icon={faAngleDown} />
          </button>
        </h2>
      )}
    </div>
  );
}
