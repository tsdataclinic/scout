import { Link } from 'react-router-dom';

type Props = {
  collections: ReadonlyArray<{
    datasetIds: string[];
    description: string;
    id: string;
    name: string;
  }>;
  onCreate: () => void;
  onDismiss: () => void;
};

export default function CollectionTabList({
  collections,
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
                <div>
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
