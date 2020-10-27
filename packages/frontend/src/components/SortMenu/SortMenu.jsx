import React, { useState } from 'react';
import { faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './SortMenu.scss';

export default function SortMenu({
  options,
  selected,
  direction,
  onSelected,
  onDirection,
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className={`sort-menu ${expanded ? 'expanded' : ''}`}>
      <div className="wrapper">
        <span>Sort By:</span>
        <ul>
          <li onClick={() => setExpanded(!expanded)}>{selected}</li>
          {options
            .filter((o) => o !== selected)
            .map((option) => (
              <li
                onClick={() => {
                  onSelected(option);
                  setExpanded(false);
                }}
                key={option}
              >
                {option}{' '}
              </li>
            ))}
        </ul>
        <FontAwesomeIcon
          onClick={() => onDirection(direction === 'asc' ? 'desc' : 'asc')}
          icon={direction === 'asc' ? faSortUp : faSortDown}
        />
      </div>
    </div>
  );
}
