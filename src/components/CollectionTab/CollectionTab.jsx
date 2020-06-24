import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetDatasetsByIds } from '../../hooks/datasets';
import { useCollections, useCurrentCollection } from '../../hooks/collections';

import './CollectionTab.scss';

export default function CollectionTab({ visible, onDismiss }) {
  const [{ collections }, { setActiveCollection }] = useCollections();
  const [
    collection,
    { removeFromCollection, createCollectionFromPending },
  ] = useCurrentCollection();
  const currentCollectionDatasets = useGetDatasetsByIds(collection.datasets);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [tab, setTab] = useState('add');

  const createCollection = () => {
    createCollectionFromPending(newCollectionName);
    setTab('add');
  };

  const selectCollection = (collectionID) => {
    setActiveCollection(collectionID);
    setTab('add');
  };

  if (!visible) return '';

  return (
    <div className="collection-tab">
      {tab === 'create' && (
        <div className="collections-tab-create">
          <h2>Create Collection</h2>
          <div className="collections-tab-create-options">
            <p>Name your new collection</p>
            <input
              placeholder="name"
              type="text"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
            />
            {collection.id === 'pending' && (
              <>
                <p>With datasets:</p>
                <ul>
                  {currentCollectionDatasets.map((c) => (
                    <li className="collection-tab-dataset">
                      <div>
                        <p className="name">{c.name}</p>
                        <p className="agency"> {c.department}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      )}

      {tab === 'add' && (
        <div className="add-to-collection">
          <div className="add-to-header">
            {collection.id !== 'pending' ? (
              <>
                <h3>Currently adding to</h3>
                <p className="collection-name">{collection.name}</p>
              </>
            ) : (
              <>
                <h3>Create a new dataset form selection</h3>
              </>
            )}
            {collections.length > 2 && (
              <button type="button" onClick={() => setTab('switch')}>
                Switch Collection
              </button>
            )}
          </div>

          <div className="collection-tab-current-collection">
            {currentCollectionDatasets.length === 0 ? (
              <div className="datasets-placeholder">
                <h3>
                  {collection.id === 'pending'
                    ? 'No datasets selected'
                    : 'This collection is empty'}
                </h3>

                <p>
                  Select `&quot;`Add to Collection`&quot;` to begin creating
                  local collections.
                </p>
              </div>
            ) : (
              <ul>
                {currentCollectionDatasets.map((d) => (
                  <li key={d.name} className="collection-tab-dataset">
                    <div>
                      <p className="name">{d.name}</p>
                      <p className="agency">{d.department}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCollection(collection.id, d.id)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
      {tab === 'switch' && (
        <div className="collections-tab-switch">
          <div className="switch-header">
            <h3>Select a Collection to add to</h3>
          </div>
          {collections.length === 1 ? (
            <div className="datasets-placeholder">
              <h3>No collections yet</h3>
            </div>
          ) : (
            <ul className="existing-collections-list">
              {collections
                .filter((c) => c.id !== 'pending')
                .map((c) => (
                  <li className="existing-collection">
                    <div className="exisiting-colections-deets">
                      <button
                        type="button"
                        className="select-collection-button"
                        onClick={() => selectCollection(c.id)}
                      >
                        <p className="name">{c.name}</p>
                        <p className="dataset-count">
                          {' '}
                          {c.datasets.length} datasets{' '}
                        </p>
                      </button>
                    </div>
                  </li>
                ))}
            </ul>
          )}
        </div>
      )}

      {tab === 'create' && (
        <div className="collection-tab-buttons">
          <button type="submit" onClick={createCollection}>
            Create
          </button>
          <button type="button" onClick={() => setTab('add')}>
            Cancel
          </button>
        </div>
      )}
      {tab === 'add' && (
        <div className="collection-tab-buttons">
          <button type="submit" onClick={() => setTab('create')}>
            Create Collection
          </button>

          <Link to="/collections">
            <button onClick={onDismiss} type="submit">
              My Collections
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
