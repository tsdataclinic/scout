import React from 'react';
import { useCollection } from '../../hooks/graphQLAPI';
import { useUserCollections } from '../../hooks/collections';
import { Link } from 'react-router-dom';
export function CollectionTabAdd({ onSwitch, onCreate, onDismiss }) {
  const [
    { activeCollection: collection },
    { removeFromCurrentCollection },
  ] = useUserCollections();

  return (
    <>
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
          <button type="button" onClick={onSwitch}>
            Switch Collection
          </button>
        </div>

        <div className="collection-tab-current-collection">
          {collection.datasets.length === 0 ? (
            <div className="datasets-placeholder">
              <h3>
                {collection.id === 'pending'
                  ? 'No datasets selected'
                  : 'This collection is empty'}
              </h3>

              <p>
                Select `&quot;`Add to Collection`&quot;` to begin creating local
                collections.
              </p>
            </div>
          ) : (
            <ul>
              {collection.datasets.map((d) => (
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
