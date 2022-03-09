import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import './ColumnSuggestions.scss';
import { useDatasetColumnsWithSuggestionCounts } from '../../hooks/graphQLAPI';
import { JoinableDatasets } from '../JoinableDatasets/JoinableDatasets';

export default function ColumnSuggestions({ global, columnId, dataset }) {
  const [collapsed, setCollapsed] = useState(true);

  const { loading, data, error } = useDatasetColumnsWithSuggestionCounts(
    columnId,
    global,
  );

  // useEffect(() => {
  //   if (collapsed === false && overlaps.length === 0) {
  //     if (joins.length > 0) {
  //       getUniqueEntries(dataset, column).then((parentUniques) => {
  //         joins.forEach((j) =>
  //           getUniqueEntries(j, column)
  //             .then((res) =>
  //               setOverlaps((perviousOverlaps) => [
  //                 ...perviousOverlaps,
  //                 {
  //                   id: j.id,
  //                   matches: parentUniques.filter((e) => res.includes(e)),
  //                   leftSize: parentUniques.length,
  //                 },
  //               ]),
  //             )
  //             .catch(() => {
  //               setOverlaps((perviousOverlaps) => [
  //                 ...perviousOverlaps,
  //                 {
  //                   id: j.id,
  //                   matches: 0,
  //                   error: 'failed to fetch',
  //                 },
  //               ]);
  //             }),
  //         );
  //       });
  //     }
  //   }
  // }, [column, dataset, joins, collapsed, overlaps]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    console.log('The error', error);
    return <p>Something went wrong</p>;
  }
  const column = data ? data.datasetColumn : null;

  return (
    <div className={`column-suggestions ${collapsed ? 'collapsed' : ''}`}>
      <div
        className="table-row"
        role="button"
        onKeyDown={() => {
          setCollapsed(!collapsed);
        }}
        onClick={() => setCollapsed(!collapsed)}
        tabIndex="0"
      >
        <span className="column-collapse">
          <FontAwesomeIcon icon={collapsed ? faAngleRight : faAngleDown} />{' '}
          {column.name}
        </span>
        <span>{column.type}</span>
        <span>{column.joinSuggestionCount} datasets</span>
      </div>

      {!collapsed && (
        <JoinableDatasets column={column} global={global} dataset={dataset} />
      )}
    </div>
  );
}
