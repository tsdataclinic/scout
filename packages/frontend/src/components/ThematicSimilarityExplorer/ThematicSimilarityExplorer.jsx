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

  console.log(data);
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
            onAddToCollection={() =>
              addToCollection(collection.id, d.dataset.id)
            }
            onRemoveFromCollection={() =>
              removeFromCollection(collection.id, d.dataset.id)
            }
            dataset={d.dataset}
            similarity={d.score}
            inCollection={collection.datasets.includes(d.dataset.id)}
          />
        ))}
      </div>
    </div>
  );
}
