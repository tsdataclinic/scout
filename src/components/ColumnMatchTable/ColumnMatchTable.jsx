import React, { useCallback, useMemo } from 'react';
import './ColumnMatchTable.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import ColumnSuggestions from '../ColumnSuggestions/ColumnSuggestions';

export default function ColumnMatchTable({ dataset, joinColumns }) {
  const columns = dataset?.resource?.columns_name || [];

  const suggestionsForColumn = useCallback(
    (col, candidates) => {
      return columns
        ? candidates.filter((c) =>
            c.joinableColumns.includes(col.toLowerCase()),
          )
        : [];
    },
    [columns],
  );

  const sortedColumns = useMemo(
    () =>
      joinColumns
        ? columns.sort((a, b) =>
            suggestionsForColumn(a, joinColumns).length <
            suggestionsForColumn(b, joinColumns).length
              ? 1
              : -1,
          )
        : [],
    [columns, joinColumns, suggestionsForColumn],
  );

  return (
    <div className="column-match-table">
      <div className="table-header">
        <ul className="table-row">
          <li>Column name</li>
          <li>Column type</li>
          <li># Potential joins</li>
        </ul>
      </div>
      {dataset
        ? sortedColumns.map((column) => (
            <ColumnSuggestions
              dataset={dataset}
              column={column}
              joins={suggestionsForColumn(column, joinColumns)}
            />
          ))
        : [...Array(6)].map((_, i) => (
            <div key={i} className="column-suggestions collapsed">
              <div className="table-row" role="button" tabIndex="0">
                <span className="column-collapse">
                  <FontAwesomeIcon icon={faAngleRight} /> ...
                </span>
                <span className="animate"> </span>
                <span className="animate"> </span>
              </div>
            </div>
          ))}
    </div>
  );
}
