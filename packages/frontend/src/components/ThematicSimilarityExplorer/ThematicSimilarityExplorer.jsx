import './ThematicSimilariryExplorer.scss';
import Dataset from '../Dataset/Dataset';
import { useSimilarDatasets } from '../../hooks/graphQLAPI';
import { useUserCollections } from '../../hooks/collections';

export function ThematicSimilarityExplorer({ datasetId, global, portal }) {
  const { loading, data, error } = useSimilarDatasets(
    datasetId,
    global ? null : portal,
  );
  const similarDatasets =
    loading || error ? [] : data.dataset.thematicallySimilarDatasets;
  const [
    ,
    {
      inCurrentCollection,
      addToCurrentCollection,
      removeFromCurrentCollection,
    },
  ] = useUserCollections();

  return (
    <div className="thematic-similarity-explorer">
      <p>
        Datasets that are thematically similar in other portals based on name
        and description
      </p>
      {loading && <p>Loading ...</p>}
      <div className="dataset-recomendataions-theme-list">
        {similarDatasets?.map(d => (
          <Dataset
            showStats={false}
            onAddToCollection={() => addToCurrentCollection(d.dataset.id)}
            onRemoveFromCollection={() =>
              removeFromCurrentCollection(d.dataset.id)
            }
            dataset={d.dataset}
            similarity={d.score}
            inCollection={inCurrentCollection(d.id)}
          />
        ))}
      </div>
    </div>
  );
}
