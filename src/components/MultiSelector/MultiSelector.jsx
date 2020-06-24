import React, { useState, useMemo, useEffect } from 'react';
import useFuse from 'react-use-fuse';
import usePagenation, { usePaginationWithItems } from '../../hooks/pagination';
import { useStateLoaded } from '../../hooks/datasets';
import FilterLoading from '../Loading/FilterLoading/FilterLoading';
import './MultiSelector.scss';

export default function MultiSelector({
  items,
  selected,
  onChange,
  title,
  collapse,
  onCollapse,
}) {
  const [collapsed, setCollapsed] = useState(true);

  const collapsedActual = collapse === null ? collapsed : collapse;

  const toggleCollapsed = () => {
    if (onCollapse) {
      onCollapse(!collapsedActual);
    } else {
      setCollapsed(!collapsedActual);
    }
  };

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

  const { result: filteredItems, search } = useFuse({
    data: items,
    options: {
      keys: ['name'],
      shouldSort: false,
      findAllMatches: true,
      caseSensitive: false,
    },
  });

  useEffect(() => search(searchTerm), [search, searchTerm]);

  const sortedItems = useMemo(
    () => filteredItems?.sort((a, b) => b.count - a.count),
    [filteredItems],
  );
  const [pagedItems, { pageButtons }] = usePaginationWithItems(sortedItems, 10);

  return (
    <div className="mutli-selector">
      <h2>
        <button
          className="header-button"
          type="button"
          onClick={() => toggleCollapsed()}
        >
          {title} <span> {collapsedActual ? '+' : '-'}</span>{' '}
        </button>
      </h2>

      {!collapsedActual && (
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
                  key={item.name}
                  onClick={() => toggleItem(item.name)}
                  className={`multi-buttons ${
                    selected && selected.includes(item.name) ? 'selected' : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selected && selected.includes(item.name)}
                    className="checkbox"
                  />
                  <span className="item-name">{item.name}</span>
                  <span className="pill">{item.count}</span>
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
