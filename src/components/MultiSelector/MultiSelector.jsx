import React, { useState, useMemo, useEffect } from 'react';
import { usePagination } from '../../hooks/pagination';
import FilterLoading from '../Loading/FilterLoading/FilterLoading';
import './MultiSelector.scss';

export default function MultiSelector({
  itemFetcher,
  selectedHook,
  title,
  onCollapse,
  noItems = 20,
}) {
  const [collapsed, setCollapsed] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const [searchTerm, setSearchTerm] = useState('');
  const [pageNumber, { pageButtons }] = usePagination({
    perPage: noItems,
    totalCount,
  });

  const { loading, error, data } = itemFetcher('data.ny.gov', {
    limit: noItems,
    page: pageNumber,
    search: searchTerm,
  });

  console.log('loading :', loading, ' error ', error, ' data ', data);

  // Update the total items when we have them
  const totalFromAPI = data ? data.portal.uniqueColumnFields.total : null;
  const pagedItems = data ? data.portal.uniqueColumnFields.items : null;

  useEffect(() => {
    if (totalFromAPI) {
      setTotalCount(totalFromAPI);
    }
  }, [totalFromAPI]);

  const [selected, setSelected] = selectedHook();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const clearItems = () => {
    setSelected([]);
  };

  const toggleItem = (item) => {
    const newSelection = selected.includes(item)
      ? selected.filter((i) => i !== item)
      : [...selected, item];
    setSelected(newSelection);
  };

  return (
    <div className="mutli-selector">
      <h2>
        <button
          className="header-button"
          type="button"
          onClick={() => toggleCollapsed()}
        >
          {title} <span> {collapsed ? '+' : '-'}</span>{' '}
        </button>
      </h2>

      {!collapsed && (
        <>
          <div className="search">
            <input
              disabled={loading}
              placeholder="filter"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              key="search"
            />
          </div>
          <ul className="multi-list">
            {loading ? (
              <FilterLoading />
            ) : (
              pagedItems.map((item) => (
                // eslint-disable-next-line
                <li
                  key={item.field}
                  onClick={() => toggleItem(item.field)}
                  className={`multi-buttons ${
                    selected && selected.includes(item.field) ? 'selected' : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selected && selected.includes(item.field)}
                    className="checkbox"
                  />
                  <span className="item-name">{item.field}</span>
                  <span className="pill">{item.occurrences}</span>
                </li>
              ))
            )}
          </ul>
          {pageButtons}
          {selected && selected.length > 0 && (
            <button type="button" onClick={clearItems}>
              clear
            </button>
          )}
        </>
      )}
    </div>
  );
}
