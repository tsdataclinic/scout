import React from 'react';
import './ThematicSimilariryExplorer.scss';
import Dataset from '../Dataset/Dataset';
import { useSimilarDatasets } from '../../hooks/graphQLAPI';
import { useCurrentCollection } from '../../hooks/collections';

export function ThematicSimilarityExplorer({ dataset }) {
  const { loading, data, error } = useSimilarDatasets(dataset.id);
  console.log('similar: loading data error ', loading, data, error);
  const similarDatasets =
    loading || error ? [] : data.dataset.thematicallySimilarDatasets;

  const [
    collection,
    { addToCollection, removeFromCollection },
  ] = useCurrentCollection();

  return (
    <div className="thematic-similarity-explorer">
      <p>
        Dataset that are thematically similar in other portals based on name and
        description
      </p>
      <div className="dataset-recomendataions-theme-list">
        {similarDatasets?.map((d) => (
          <Dataset
            showStats={false}
            onAddToCollection={() => addToCollection(collection.id, d.id)}
            onRemoveFromCollection={() =>
              removeFromCollection(collection.id, d.id)
            }
            dataset={d}
            similarity={10}
            inCollection={collection.datasets.includes(d.id)}
          />
        ))}
      </div>
    </div>
  );
}
