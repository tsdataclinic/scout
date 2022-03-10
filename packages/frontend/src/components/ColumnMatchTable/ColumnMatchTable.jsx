import { useMemo } from 'react';
import './ColumnMatchTable.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import ColumnSuggestions from '../ColumnSuggestions/ColumnSuggestions';

export default function ColumnMatchTable({ dataset, global }) {
  const columns = useMemo(() => {
    if (dataset) {
      // remove duplicate columns
      const seenIds = new Set();
      const newColumns = [];
      dataset.datasetColumns.forEach(col => {
        if (!seenIds.has(col.id)) {
          newColumns.push(col);
          seenIds.add(col.id);
        }
      });
      return newColumns;
    }
    return [];
  }, [dataset]);

  // const colJoins =
  //   columns && joinColumns
  //     ? columns.map((c) => ({
  //         column: c,
  //         joins: joinColumns.filter((d) => d.columnFields.includes(c)),
  //       }))
  //     : [];

  // const sortedColumns = colJoins
  //   ? colJoins.sort((a, b) => b.joins.length - a.joins.length)
  //   : [];

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
        ? columns.map(column => (
            <ColumnSuggestions
              key={column.id}
              dataset={dataset}
              columnId={column.id}
              global={global}
            />
          ))
        : [...Array(6)].map((_, i) => (
            // eslint-disable-next-line react/no-array-index-key
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
