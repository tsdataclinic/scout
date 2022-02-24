import React from 'react';
import { useJoinableDatasetsPaged } from '../../hooks/graphQLAPI';
import './JoinableDatasets.scss';
import { usePagination } from '../../hooks/pagination';
import JoinColumn from '../JoinColumn/JoinColumn';

export function JoinableDatasets({ column, global }) {
  const [pageNo, { pageButtons }] = usePagination({
    totalCount: column.joinSuggestionsCount,
    perPage: 10,
  });

  const { data, loading, error } = useJoinableDatasetsPaged(
    column.id,
    global,
    10,
    pageNo,
  );

  const pagedJoins = data ? data.datasetColumn.joinSuggestions : [];

  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Something went wrong</p>;
  }

  return (
    <div className="columns-suggestions-matches">
      <h3>MATCHING DATASETS</h3>
      {pagedJoins && (
        <ul>
          {pagedJoins.map(join => (
            <li key={join.column.dataset.id}>
              <JoinColumn
                dataset={join.column.dataset}
                matches={[]}
                matchPC={join.potentialOverlap}
              />
            </li>
          ))}
        </ul>
      )}
      {pageButtons}
    </div>
  );
}
