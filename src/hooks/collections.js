import { useCollectionsValue } from '../contexts/CollectionsContext';

export function useCurrentCollection() {
  const [state, dispatch] = useCollectionsValue();
  const { activeCollectionID, pendingCollection } = state;

  const collection = activeCollectionID
    ? state.collections.find((c) => c.id === state.activeCollectionID)
    : pendingCollection;

  const addToCollection = (collectionID, datasetID) => {
    dispatch({
      type: 'ADD_TO_COLLECTION',
      payload: { id: collectionID, datasetID },
    });
  };

  const createCollectionFromPending = (name) => {
    dispatch({
      type: 'CREATE_COLLECTION_FROM_PENDING',
      payload: { name },
    });
  };

  const removeFromCollection = (collectionID, datasetID) =>
    dispatch({
      type: 'REMOVE_FROM_COLLECTION',
      payload: { id: collectionID, datasetID },
    });

  const setName = (name, collectionID) =>
    dispatch({
      type: 'SET_NAME',
      payload: { id: collectionID, name },
    });

  const clearCollection = (collectionID) => {
    dispatch({ type: 'CLEAR_COLLECTION', payload: { id: collectionID } });
  };
  return [
    collection,
    {
      clearCollection,
      addToCollection,
      removeFromCollection,
      setName,
      createCollectionFromPending,
    },
  ];
}

export function useCollections() {
  const [state] = useCollectionsValue();
  return state;
}
