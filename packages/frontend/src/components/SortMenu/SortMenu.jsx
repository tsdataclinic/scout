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
  const onMenuToggle = () => setExpanded(!expanded);
  const onOptionSelection = option => {
    onSelected(option);
    setExpanded(false);
  };

  return (
    <div className={`sort-menu ${expanded ? 'expanded' : ''}`}>
      <div className="wrapper">
        <span>Sort By:</span>
        <ul>
          <li>
            <div
              tabIndex="0"
              role="button"
              onClick={onMenuToggle}
              onKeyPress={onMenuToggle}
            >
              {selected}
            </div>
          </li>
          {options
            .filter(o => o !== selected)
            .map(option => (
              <li key={option}>
                <div
                  tabIndex="0"
                  role="button"
                  onKeyPress={() => onOptionSelection(option)}
                  onClick={() => onOptionSelection(option)}
                >
                  {option}{' '}
                </div>
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
