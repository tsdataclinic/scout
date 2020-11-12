import React from 'react';
import { useUserCollections } from '../../hooks/collections';

export const CollectionTabSwitch = ({ onSwitch }) => {
  const [{ collections }, { setActiveCollection }] = useUserCollections();
  console.log(
    'collections ',
    collections.map((c) => c.datasets),
  );

  const selectCollection = (id) => {
    setActiveCollection(id);
    onSwitch();
  };
  return (
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
                      {c.datasets ? c.datasets.length : 0} datasets{' '}
                    </p>
                  </button>
                </div>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};
