import { useCollectionsValue } from '../contexts/CollectionsContext';
import {
  useAddToCollection,
  useCurrentUserCollections,
  useDatasetsFromIds,
} from './graphQLAPI';

export function useUserCollections() {
  const [state, dispatch] = useCollectionsValue();

  const { data } = useCurrentUserCollections();

  // TODO: fix  - this gets triggered 40+ times on each refresh.
  // This does not seem very performant.
  console.log('CURRENT USER COLLECTIONS', data);

  const { data: pendingDatasets } = useDatasetsFromIds(state.pendingCollection);

  const serverCollections = data ? data.profile.collections : [];

  const [addTo] = useAddToCollection();

  const setActiveCollection = (collectionID) => {
    dispatch({
      type: 'SET_ACTIVE_COLLECTION',
      payload: collectionID,
    });
  };

  const combinedState = {
    activeCollectionID: state.activeCollectionID,
    collections: [state.pendingCollection, ...serverCollections],
    activeCollection:
      state.activeCollectionID === 'pending'
        ? {
            name: 'Pending Collection',
            description: 'placeholder',
            datasets: pendingDatasets ? pendingDatasets.datasetsByIds : [],
          }
        : serverCollections.find((c) => c.id === state.activeCollectionID),
  };

  const inCurrentCollection = (id) => {
    if (state.activeCollectionID === 'pending') {
      return state.pendingCollection.includes(id);
    }
    if (serverCollections) {
      const collection = serverCollections.find(
        (c) => c.id === state.activeCollectionID,
      );
      if (collection) {
        return collection.datasets.find((d) => d.id === id);
      }
      return false;
    }
    return false;
  };

  const addToCurrentCollection = async (datasetID) => {
    if (state.activeCollectionID === 'pending') {
      dispatch({
        type: 'ADD_TO_PENDING_COLLECTION',
        payload: datasetID,
      });
    } else {
      addTo({
        variables: { id: state.activeCollectionID, datasetIds: [datasetID] },
      });
    }
  };

  const removeFromCurrentCollection = (datasetID) => {
    if (state.activeCollectionID === 'pending') {
      dispatch({
        type: 'REMOVE_FROM_PENDING_COLLECTION',
        payload: datasetID,
      });
    }
  };

  const createFromPending = () => {
    console.log('creating from pending');
  };

  // console.log('combined state is ', combinedState);
  return [
    combinedState,
    {
      addToCurrentCollection,
      removeFromCurrentCollection,
      inCurrentCollection,
      createFromPending,
      setActiveCollection,
    },
  ];
}
