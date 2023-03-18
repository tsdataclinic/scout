import { useMemo } from 'react';
import './ThematicSimilariryExplorer.scss';
import Dataset from '../Dataset/Dataset';
import { useSimilarDatasets } from '../../hooks/graphQLAPI';
import LoadingIndicator from '../ui/LoadingIndicator';

export function ThematicSimilarityExplorer({ datasetId, global, portal }) {
  const { loading, data, error } = useSimilarDatasets(
    datasetId,
    global ? null : portal,
  );

  const similarDatasets = useMemo(() => {
    const loadedDatasets =
      loading || error ? [] : data.dataset.thematicallySimilarDatasets;

    // don't show this dataset as being similar to itself
    return loadedDatasets.filter(({ dataset }) => dataset.id !== datasetId);
  }, [data, loading, error, datasetId]);

  return (
    <div className="thematic-similarity-explorer space-y-4">
      <p>
        Datasets that are thematically similar in other portals based on name
        and description
      </p>
      {loading && <LoadingIndicator />}
      <div className="dataset-recomendataions-theme-list">
        {similarDatasets?.map(d => (
          <Dataset showStats={false} dataset={d.dataset} similarity={d.score} />
        ))}
      </div>
    </div>
  );
}
