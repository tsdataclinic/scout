import React, { useState, useMemo, useEffect } from 'react';
import useFuse from 'react-use-fuse';
import usePagenation from '../../hooks/pagination';
import './MultiSelector.scss';

export default function MultiSelector({ items, selected, onChange, title }) {
  const clearItems = () => {
    onChange([]);
  };

  const [searchTerm, setSearchTerm] = useState('');

  const toggleItem = (item) => {
    const newSelection = selected.includes(item)
      ? selected.filter((i) => i !== item)
      : [...selected, item];

    onChange(newSelection);
  };

  const itemNames = useMemo(() => Object.keys(items), [items]);

  const { filteredItems, search } = useFuse({
    data: itemNames,
    options: {
      shouldSort: false,
      findAllMatches: true,
      caseSensitive: false,
    },
  });

  useEffect(() => search(searchTerm), [search, searchTerm]);
  console.log('filtering categories ', searchTerm, itemNames, filteredItems);
  const [pagedItems, { pageButtons }] = usePagenation(
    filteredItems || itemNames,
    10,
  );

  return (
    <div className="mutli-selector">
      <h2>{title}</h2>
      <div className="search">
        <input
          placeholder="filter"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <ul className="multi-list">
        {pagedItems.map((item) => (
          /* eslint-disable */
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
          /* eslint-enable */
        ))}
      </ul>
      {pageButtons}
      {selected && selected.length > 0 && (
        <button type="button" onClick={clearItems}>
          clear
        </button>
      )}
    </div>
  );
}
