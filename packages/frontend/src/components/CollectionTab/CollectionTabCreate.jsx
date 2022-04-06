import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  useCreateCollection,
  useDatasetsFromIds,
} from '../../hooks/graphQLAPI';
import { useUserCollections } from '../../hooks/collections';
import useCurrentUser from '../../auth/useCurrentUser';

export function CollectionTabCreate({ isPending, datasetIds, onDone }) {
  const { isAuthenticated } = useCurrentUser();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [, setErrorMessage] = useState(null);
  const { loading: loadingDatasets, data: datasetData } =
    useDatasetsFromIds(datasetIds);
  const [createCollection] = useCreateCollection();
  const [, { createCollectionFromPending, createEmptyCollection }] =
    useUserCollections();

  const onTryCreateCollection = async () => {
    try {
      let collectionId;
      if (isAuthenticated) {
        const result = await createCollection({
          variables: {
            name,
            description,
            datasetIds: isPending ? datasetIds : [],
          },
        });
        collectionId = result.data.createCollection.id;
      } else {
        collectionId = uuidv4();
      }

      if (isPending) {
        createCollectionFromPending({
          name,
          description,
          datasetIds,
          id: collectionId,
        });
      } else {
        createEmptyCollection({
          id: collectionId,
          name,
          description,
          datasetIds: [],
        });
      }
      onDone(collectionId);
    } catch (err) {
      setErrorMessage('Something went wrong');
    }
  };

  const datasets = datasetData ? datasetData.datasetsByIds : [];

  return (
    <div className="collections-tab-create">
      <h2>Create Collection</h2>
      <div className="collections-tab-create-options">
        <p>Name your new collection</p>
        <input
          placeholder="name"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <p>Describe your collection</p>
        <input
          placeholder="description"
          type="text"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        {isPending && datasets.length > 0 && (
          <>
            <p>With datasets:</p>
            {loadingDatasets && <p>Loading ...</p>}
            <ul>
              {datasets.map(d => (
                <li key={d.id} className="collection-tab-dataset">
                  <div>
                    <p className="name">{d.name}</p>
                    <p className="agency"> {d.department}</p>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
      <div className="collection-tab-buttons">
        <button type="submit" onClick={onTryCreateCollection}>
          Create
        </button>
        <button type="button" onClick={() => onDone(undefined)}>
          Cancel
        </button>
      </div>
    </div>
  );
}
