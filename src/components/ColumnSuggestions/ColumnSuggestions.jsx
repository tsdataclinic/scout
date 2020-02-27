import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import JoinColumn from '../JoinColumn/JoinColumn';
import './ColumnSuggestions.scss';
import usePagination from '../../hooks/pagination';
import { getUniqueEntries } from '../../utils/socrata';

export default function ColumnSuggestions({ column, joins, dataset }) {
  const [collapsed, setCollapsed] = useState(true);
  const [overlaps, setOverlaps] = useState(null);

  const dataTypeForCol =
    dataset.resource.columns_datatype[
      dataset.resource.columns_name.indexOf(column)
    ];

  const [pagedJoins, { pageButtons }] = usePagination(
    overlaps
      ? overlaps.map((o) => joins.find((j) => j.dataset.resource.id === o.id))
      : joins,
    10,
  );

  if (overlaps) {
    console.log('overlaps are ', overlaps);
  }
  if (overlaps) {
    console.log('paged joins are ', pagedJoins);
  }

  useEffect(() => {
    if (collapsed === false && overlaps === null) {
      if (joins.length > 0) {
        getUniqueEntries(dataset, column).then((parentUniques) => {
          Promise.all(
            joins.map((j) =>
              getUniqueEntries(j.dataset, column).then((res) => ({
                id: j.dataset.resource.id,
                matches: parentUniques.filter((e) => res.includes(e)),
              })),
            ),
          ).then((results) =>
            setOverlaps(
              results.sort((a, b) =>
                a.matches.length > b.matches.length ? -1 : 1,
              ),
            ),
          );
        });
      }
    }
  }, [column, dataset, joins, collapsed, overlaps]);

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
        <span>{joins.length} datasets also have this column</span>
      </div>
      {!collapsed && pagedJoins && (
        <div className="columns-suggestions-matches">
          <h3>MATCHING DATSETS</h3>
          {joins && overlaps && (
            <ul>
              {pagedJoins.map((join) => (
                <li key={join.dataset.resource.id}>
                  <JoinColumn
                    leftDataset={dataset}
                    rightDataset={join.dataset}
                    joinCol={column}
                    matches={
                      overlaps.find((o) => o.id === join.dataset.resource.id)
                        .matches
                    }
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
