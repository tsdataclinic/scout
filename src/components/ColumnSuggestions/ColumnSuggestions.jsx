import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import JoinColumn from '../JoinColumn/JoinColumn';
import './ColumnSuggestions.scss';
import { usePaginationWithItems } from '../../hooks/pagination';
import { getUniqueEntries } from '../../utils/socrata';

export default function ColumnSuggestions({ column, joins, dataset }) {
  const [collapsed, setCollapsed] = useState(true);
  const [overlaps, setOverlaps] = useState([]);

  const dataTypeForCol =
    dataset.columnTypes[dataset.columnFields.indexOf(column)];

  const [pagedJoins, { pageButtons }] = usePaginationWithItems(
    overlaps
      ? overlaps
          .sort((a, b) => (a.matches.length < b.matches.length ? 1 : -1))
          .map((o) => joins.find((j) => j.id === o.id))
      : joins,
    10,
  );
  useEffect(() => {
    if (collapsed === false && overlaps.length === 0) {
      if (joins.length > 0) {
        getUniqueEntries(dataset, column).then((parentUniques) => {
          joins.forEach((j) =>
            getUniqueEntries(j, column)
              .then((res) =>
                setOverlaps((perviousOverlaps) => [
                  ...perviousOverlaps,
                  {
                    id: j.id,
                    matches: parentUniques.filter((e) => res.includes(e)),
                    leftSize: parentUniques.length,
                  },
                ]),
              )
              .catch(() => {
                setOverlaps((perviousOverlaps) => [
                  ...perviousOverlaps,
                  {
                    id: j.id,
                    matches: 0,
                    error: 'failed to fetch',
                  },
                ]);
              }),
          );
        });
      }
    }
  }, [column, dataset, joins, collapsed, overlaps]);

  if (column === 'non_ell_principal') {
    console.log(
      'STATS ',
      joins.length,
      '  ',
      overlaps.length,
      ' ',
      pagedJoins.length,
    );
  }
  return (
    <div className={`column-suggestions ${collapsed ? 'collapsed' : ''}`}>
      <div
        className="table-row"
        role="button"
        onKeyDown={(e) => {
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
          <h3>MATCHING DATASETS</h3>
          {joins && overlaps && (
            <ul>
              {pagedJoins.map((join) => (
                <li key={join.id}>
                  <JoinColumn
                    leftDataset={dataset}
                    rightDataset={join}
                    joinCol={column}
                    matches={overlaps.find((o) => o.id === join.id)}
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
