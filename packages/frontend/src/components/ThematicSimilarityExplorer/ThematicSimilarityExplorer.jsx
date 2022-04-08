import { useMemo } from 'react';
import './ThematicSimilariryExplorer.scss';
import Dataset from '../Dataset/Dataset';
import { useSimilarDatasets } from '../../hooks/graphQLAPI';

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
    <div className="thematic-similarity-explorer">
      <p>
        Datasets that are thematically similar in other portals based on name
        and description
      </p>
      {loading && <p>Loading ...</p>}
      <div className="dataset-recomendataions-theme-list">
        {similarDatasets?.map(d => (
          <Dataset showStats={false} dataset={d.dataset} similarity={d.score} />
        ))}
      </div>
    </div>
  );
}
