import React, { useCallback,useMemo } from 'react';
import ColumnSuggestions from '../ColumnSuggestions/ColumnSuggestions';
import './ColumnMatchTable.scss';

export default function ColumnMatchTable({ dataset, joinColumns }) {
  const columns = dataset.resource.columns_name;

  const suggestionsForColumn = useCallback((col, candidates) =>
    columns ? candidates.filter((c) => c.joinableColumns[0] === col) : [], [joinColumns]);

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
          <li>No potential joins</li>
        </ul>
      </div>
      {sortedColumns.map((column) => (
        <ColumnSuggestions
          dataset={dataset}
          column={column}
          joins={suggestionsForColumn(column, joinColumns)}
        />
      ))}
    </div>
  );
}
