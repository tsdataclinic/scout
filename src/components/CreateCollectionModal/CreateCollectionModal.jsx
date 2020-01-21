import React from 'react';
import useCollection from '../../hooks/collections';
import { useDatasets } from '../../hooks/datasets';
import './CreateCollectionModal.scss';

export default function CreateCollectionModal({ history }) {
  const [collection, { setName }] = useCollection();
  const datasets = useDatasets({ ids: collection.datasets });

  const createCollection = (newCollection) => {
    const collectionURL = `/collection/${
      newCollection.name
    }/${newCollection.datasets.join(',')}`;
    history.push(collectionURL);
  };

  return (
    <div className="create-collection-modal">
      <h3>Create collection with the following datasets</h3>
      <ul>
        {datasets.map((dataset) => (
          <li>{dataset.resource.name}</li>
        ))}
      </ul>
      <input
        type="text"
        placeholder="Name"
        value={collection.name}
        onChange={(e) => setName(e.target.value)}
      />
      <button type="submit" onClick={() => createCollection(collection)}>
        Create
      </button>
    </div>
  );
}
