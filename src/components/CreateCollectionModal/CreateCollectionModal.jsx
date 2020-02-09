import React from 'react';
import { Link } from 'react-router-dom';
import useCollection from '../../hooks/collections';
import { useGetDatasetsByIds } from '../../hooks/datasets';
import './CreateCollectionModal.scss';

export default function CreateCollectionModal() {
  const [collection, { clearCollection, setName }] = useCollection();
  const datasets = useGetDatasetsByIds(collection.datasets);

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
      <Link
        to={`/collection/${collection.name}/${collection.datasets.join(',')}`}
      >
        <button type="submit" onClick={clearCollection}>
          Create
        </button>
      </Link>
    </div>
  );
}
