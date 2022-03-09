/* eslint-disable no-unused-vars */
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import MultiSelector from '../MultiSelector/MultiSelector';
import ColumnSelector from './ColumnSelector';

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

export default function Filters({
  collapsed,
  onCollapseFilterBar,
  portal,
  globalSearch,
}) {
  const [filterStates, setFilterState] = useFilterUIStates();
  const [selectedCategories, setSelectedCategories] = useSelectedCategories();
  const [selectedTags, setSelectedTags] = useSelectedTags();
  const [selectedColumns, setSelectedColumns] = useSelectedColumns();
  const [selectedDepartments, setSelectedDepartments] =
    useSelectedDepartments();

  // TODO: handle filters with global search
  console.log('is global', globalSearch);

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
              */}
          </div>
          <div className="departments">
            {/*
            <MultiSelector
              itemFetcher={useDepartmentsGQL}
              selectedHook={useSelectedDepartments}
              collapse={filterStates.departments}
              onCollapse={isCollapsed =>
                setFilterState('departments', isCollapsed)
              }
              title="Departments"
              portalId={portal.id}
            />
            */}
          </div>
          <div className="columns">
            <ColumnSelector portalId={portal.id} />
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
