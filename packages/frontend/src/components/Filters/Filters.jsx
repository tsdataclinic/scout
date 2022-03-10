/* eslint-disable no-unused-vars */
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import ColumnSelector from './ColumnSelector';
import CategoriesSelector from './CategoriesSelector';
import DepartmentSelector from './DepartmentSelector';

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
            <div className="departments">
              <DepartmentSelector
                portalId={portal.id}
                isGlobal={globalSearch}
              />
            </div>
            <div className="columns">
              <ColumnSelector portalId={portal.id} isGlobal={globalSearch} />
            </div>
            <div className="categories">
              <CategoriesSelector
                portalId={portal.id}
                isGlobal={globalSearch}
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
