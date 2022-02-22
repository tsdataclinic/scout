import React from 'react';
import { Link } from 'react-router-dom';
import { useUserCollections } from '../../hooks/collections';

export function CollectionTabAdd({ onSwitch, onCreate, onDismiss }) {
  const [{ activeCollection }, { removeFromCurrentCollection }] =
    useUserCollections();
  console.log('Active collection', activeCollection);

  return (
    <>
      <div className="add-to-collection">
        <div className="add-to-header">
          {activeCollection.id !== 'pending' ? (
            <>
              <h3>Currently adding to</h3>
              <p className="collection-name">{activeCollection.name}</p>
            </>
          ) : (
            <h3>Create a new dataset form selection</h3>
          )}

          {activeCollection.id !== 'pending' ? (
            <button type="button" onClick={onSwitch}>
              Switch Collection
            </button>
          ) : null}
        </div>

        <div className="collection-tab-current-collection">
          {activeCollection.datasets.length === 0 ? (
            <div className="datasets-placeholder">
              <h3>
                {activeCollection.id === 'pending'
                  ? 'No datasets selected'
                  : 'This collection is empty'}
              </h3>

              <p>
                Select &quot;Add to Collection&quot; to begin creating local
                collections.
              </p>
            </div>
          ) : (
            <ul>
              {activeCollection.datasets.map(d => (
                <li key={d.name} className="collection-tab-dataset">
                  <div>
                    <p className="name">{d.name}</p>
                    <p className="agency">{d.department}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCurrentCollection(d.id)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="collection-tab-buttons">
        <button type="submit" onClick={onCreate}>
          Create Collection
        </button>

        <Link to="/collections">
          <button onClick={onDismiss} type="submit">
            My Collections
          </button>
        </Link>
      </div>
    </>
  );
}
