import { Link } from 'react-router-dom';

type Collection = {
  datasetIds: string[];
  description: string;
  id: string;
  name: string;
};

type Props = {
  collections: readonly Collection[];
  onCollectionSelect: (collection: Collection) => void;
  onCreate: () => void;
  onDismiss: () => void;
};

export default function CollectionTabList({
  collections,
  onCollectionSelect,
  onCreate,
  onDismiss,
}: Props): JSX.Element {
  return (
    <>
      <div className="add-to-collection">
        <div className="add-to-header">
          <h3>My Collections</h3>
        </div>
        <div className="collection-tab-current-collection">
          <ul>
            {collections.map(collection => (
              <li key={collection.id} className="collection-tab-dataset">
                <div
                  role="button"
                  tabIndex={0}
                  onKeyPress={e => {
                    if (e.key === 'Enter') {
                      onCollectionSelect(collection);
                    }
                  }}
                  onClick={() => {
                    onCollectionSelect(collection);
                  }}
                >
                  <p className="name">{collection.name}</p>
                  <p className="agency">{collection.description}</p>
                </div>
              </li>
            ))}
          </ul>
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
