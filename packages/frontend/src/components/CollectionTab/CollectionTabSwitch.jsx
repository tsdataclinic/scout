import React from 'react';
import { useUserCollections } from '../../hooks/collections';

export function CollectionTabSwitch({ onSwitch }) {
  const [{ collections }, { setActiveCollection }] = useUserCollections();
  const selectCollection = id => {
    setActiveCollection(id);
    onSwitch();
  };

  return (
    <div className="collections-tab-switch">
      <div className="switch-header">
        <h3>Select a Collection to add to</h3>
      </div>
      {collections.length === 0 ? (
        <div className="datasets-placeholder">
          <h3>No collections yet</h3>
        </div>
      ) : (
        <ul className="existing-collections-list">
          {collections
            .filter(c => c.id !== 'pending')
            .map(c => (
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
                      {c.datasetIds ? c.datasetIds.length : 0} datasets{' '}
                    </p>
                  </button>
                </div>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
