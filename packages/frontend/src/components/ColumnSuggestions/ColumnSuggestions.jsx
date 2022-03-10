import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import './ColumnSuggestions.scss';
import { useDatasetColumnsWithSuggestionCounts } from '../../hooks/graphQLAPI';
import { JoinableDatasets } from '../JoinableDatasets/JoinableDatasets';

/**
 * This is one row in the ColumnMatchTable. It renders the column name, type,
 * and how many joinable datasets there are.
 *
 * This row can in turn be expanded to show the joinable datasets.
 */
export default function ColumnSuggestions({ global, columnId, dataset }) {
  const [collapsed, setCollapsed] = useState(true);

  const { loading, data, error } = useDatasetColumnsWithSuggestionCounts(
    columnId,
    global,
  );
  const column = data ? data.datasetColumn : null;

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Something went wrong</p>;
  }

  return (
    <div className={`column-suggestions ${collapsed ? 'collapsed' : ''}`}>
      <div
        className="table-row"
        role="button"
        onKeyDown={e => {
          if (e.code === 'Space') {
            setCollapsed(!collapsed);
          }
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

      {collapsed ? null : (
        <JoinableDatasets column={column} global={global} dataset={dataset} />
      )}
    </div>
  );
}
