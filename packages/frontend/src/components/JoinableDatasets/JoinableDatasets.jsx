import { useEffect, useMemo } from 'react';
import { getUniqueEntries } from '../../utils/socrata';
import { useJoinableDatasetsPaged } from '../../hooks/graphQLAPI';
import './JoinableDatasets.scss';
import { usePagination } from '../../hooks/pagination';
import JoinColumn from '../JoinColumn/JoinColumn';

export function JoinableDatasets({ column, global, dataset }) {
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

  const pagedJoins = useMemo(
    () => (data ? data.datasetColumn.joinSuggestions : []),
    [data],
  );
  console.log('Joinable dataset props', { column, dataset });

  // query for the joinable dataset ids to figure out the % match
  useEffect(() => {
    console.log('hello');
    if (!column && column.joinSuggestionCount > 0) {
      console.log('doing socrata query!');
      getUniqueEntries(dataset, column).then(parentUniques => {
        console.log('oh holy shit', parentUniques);
        pagedJoins.forEach(
          _j => undefined,
          /*
          getUniqueEntries(j, column)
            .then(res =>
              setOverlaps(perviousOverlaps => [
                ...perviousOverlaps,
                {
                  id: j.id,
                  matches: parentUniques.filter(e => res.includes(e)),
                  leftSize: parentUniques.length,
                },
              ]),
            )
            .catch(() => {
              setOverlaps(perviousOverlaps => [
                ...perviousOverlaps,
                {
                  id: j.id,
                  matches: 0,
                  error: 'failed to fetch',
                },
              ]);
            }),
            */
        );
      });
    }
  }, [column, pagedJoins, dataset]);
  //  }, [column, dataset, joins, collapsed, overlaps]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Something went wrong</p>;
  }

  console.log('join result', data?.datasetColumn);

  return (
    <div className="columns-suggestions-matches">
      <h3 style={{ textTransform: 'uppercase' }}>Matching datasets</h3>
      {pagedJoins && pagedJoins.length > 0 ? (
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
      ) : (
        <div>No matching datasets found</div>
      )}
      {pagedJoins && pagedJoins.length > 0 ? pageButtons : null}
    </div>
  );
}
