import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import JoinColumn from '../JoinColumn/JoinColumn';
import './ColumnSuggestions.scss';
import usePagination from '../../hooks/pagination';
import { getUniqueEntries } from '../../utils/socrata';

export default function ColumnSuggestions({ column, joins, dataset }) {
  const [columnUniques, setColumnsUniques] = useState([]);

  const [collapsed, setCollapsed] = useState(true);
  const dataTypeForCol =
    dataset.resource.columns_datatype[
      dataset.resource.columns_name.indexOf(column)
    ];

  const [pagedJoins, { pageButtons }] = usePagination(joins, 10);

  useEffect(() => {
    if (joins.length > 0) {
      getUniqueEntries(dataset, column).then((res) => {
        setColumnsUniques(res);
      });
    }
  }, [column, dataset, joins]);

  return (
    <div className={`column-suggestions ${collapsed ? 'collapsed' : ''}`}>
      <div
        className="table-row"
        role="button"
        onKeydown={(e) => {
          if (e.keyCode === 36) {
            setCollapsed(!collapsed);
          }
        }}
        onClick={() => setCollapsed(!collapsed)}
        tabIndex="0"
      >
        <span className="column-collapse">
          <FontAwesomeIcon icon={collapsed ? faAngleRight : faAngleDown} />{' '}
          {column}
        </span>
        <span>{dataTypeForCol}</span>
        <span>{joins.length} datasets</span>
      </div>
      {!collapsed && pagedJoins && (
        <div className="columns-suggestions-matches">
          <h3>MATCHING DATSETS</h3>
          {joins && (
            <ul>
              {pagedJoins.map((join) => (
                <li key={join.dataset.resource.id}>
                  <JoinColumn
                    leftDataset={dataset}
                    rightDataset={join.dataset}
                    joinCol={column}
                    parentUniques={columnUniques}
                  />
                </li>
              ))}
            </ul>
          )}
          {pageButtons}
        </div>
      )}
    </div>
  );
}
