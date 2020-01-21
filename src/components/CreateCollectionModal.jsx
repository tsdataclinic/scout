import React from 'react';
import useCollection from '../hooks/collections';
import { useDatasets } from '../hooks/datasets';

export default function CreateCollectionModal({ history }) {
  const [collection, { setName }] = useCollection();
  const datasets = useDatasets({ ids: collection.datasets });

  const createCollection = (newCollection) => {
    const collectionURL = `/newCollection/${
      newCollection.name
    }/${newCollection.datasets.join(',')}`;
    history.push(collectionURL);
  };

  return (
    <div className="create-collection-modal">
      <h3>Create collection with the following datasets</h3>
      <input
        type="text"
        placeholder="Name"
        value={collection.name}
        onChange={(e) => setName(e.target.value)}
      />
      <ul>
        {datasets.map((dataset) => (
          <li>{dataset.resource.name}</li>
        ))}
      </ul>
      <button type="submit" onClick={() => createCollection(collection)}>
        Create
      </button>
    </div>
  );
}
