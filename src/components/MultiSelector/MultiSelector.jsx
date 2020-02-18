import React, { useState, useMemo, useEffect } from 'react';
import useFuse from 'react-use-fuse';
import usePagenation from '../../hooks/pagination';
import { useStateLoaded } from '../../hooks/datasets';
import FilterLoading from '../Loading/FilterLoading/FilterLoading';
import './MultiSelector.scss';

export default function MultiSelector({ items, selected, onChange, title }) {
  const [collapsed, setCollapsed] = useState(true);

  const clearItems = () => {
    onChange([]);
  };

  const loaded = useStateLoaded();

  const [searchTerm, setSearchTerm] = useState('');

  const toggleItem = (item) => {
    const newSelection = selected.includes(item)
      ? selected.filter((i) => i !== item)
      : [...selected, item];
    onChange(newSelection);
  };

  const itemNames = useMemo(() => items && Object.keys(items), [items]);

  const { result: filteredItems, search } = useFuse({
    data: itemNames.map((item) => ({
      name: item,
    })),
    options: {
      keys: ['name'],
      shouldSort: false,
      findAllMatches: true,
      caseSensitive: false,
    },
  });

  useEffect(() => search(searchTerm), [search, searchTerm]);

  const sortedItems = useMemo(
    () =>
      filteredItems
        ?.map((item) => item.name)
        .sort((a, b) => (items[a] < items[b] ? 1 : -1)),
    [filteredItems, items],
  );

  const [pagedItems, { pageButtons }] = usePagenation(sortedItems, 10);

  return (
    <div className="mutli-selector">
      <h2>
        <button
          className="header-button"
          type="button"
          onClick={() => setCollapsed(!collapsed)}
        >
          {title} <span> {collapsed ? '+' : '-'}</span>{' '}
        </button>
      </h2>

      {!collapsed && (
        <>
          <div className="search">
            <input
              disabled={!loaded}
              placeholder="filter"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <ul className="multi-list">
            {!loaded ? (
              <FilterLoading />
            ) : (
              pagedItems.map((item) => (
                // eslint-disable-next-line
                <li
                  key={item}
                  onClick={() => toggleItem(item)}
                  className={`multi-buttons ${
                    selected && selected.includes(item) ? 'selected' : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selected && selected.includes(item)}
                    className="checkbox"
                  />
                  <span className="item-name">{item}</span>
                  <span className="pill">{items[item]}</span>
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
