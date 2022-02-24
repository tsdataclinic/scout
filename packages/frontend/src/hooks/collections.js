import { useCollectionsValue } from '../contexts/CollectionsContext';
import {
  useAddToCollection,
  useCurrentUserCollections,
  useDatasetsFromIds,
} from './graphQLAPI';
import { USE_SINGLE_CITY } from '../flags';

export function useUserCollections() {
  // TODO: This function gets triggered 40+ times on each refresh. This does
  // not seem very performant
  const [state, dispatch] = useCollectionsValue();
  const { data } = useCurrentUserCollections();
  const { data: pendingDatasets } = useDatasetsFromIds(state.pendingCollection);
  const serverCollections = data ? data.profile.collections : [];
  const [addTo] = useAddToCollection();

  const localAndServerCollections = (state.collections || []).concat(
    serverCollections,
  );

  const activeNonPendingCollection = localAndServerCollections.find(
    c => c.id === state.activeCollectionID,
  );

  const { data: collectionDatasets } = useDatasetsFromIds(
    activeNonPendingCollection ? activeNonPendingCollection.datasetIds : [],
  );

  const combinedState = {
    activeCollectionID: state.activeCollectionID,
    collections: localAndServerCollections,
    activeCollection:
      state.activeCollectionID === 'pending'
        ? {
            id: 'pending',
            name: 'Pending Collection',
            description: 'placeholder',
            datasetIds: state.pendingCollection,
            datasets: pendingDatasets ? pendingDatasets.datasetsByIds : [],
            createdAt: new Date(),
          }
        : {
            ...activeNonPendingCollection,
            datasetIds: activeNonPendingCollection?.datasetIds || [],
            datasets: collectionDatasets
              ? collectionDatasets.datasetsByIds
              : [],
          },
  };

  const setActiveCollection = collectionID => {
    dispatch({
      type: 'SET_ACTIVE_COLLECTION',
      payload: collectionID,
    });
  };

  const inCurrentCollection = id => {
    if (state.activeCollectionID === 'pending') {
      return state.pendingCollection.includes(id);
    }

    if (state.collections) {
      const currentCollection = state.collections.find(
        c => c.id === state.activeCollectionID,
      );
      return currentCollection
        ? currentCollection.datasetIds.includes(id)
        : false;
    }

    if (serverCollections) {
      const collection = serverCollections.find(
        c => c.id === state.activeCollectionID,
      );
      if (collection) {
        return collection.datasets.find(d => d.id === id);
      }
      return false;
    }
    return false;
  };

  const addToCurrentCollection = async datasetID => {
    if (state.activeCollectionID === 'pending') {
      // the collection doesn't exist in the backend yet, so we just have
      // to add to the collection in-browser.
      dispatch({
        type: 'ADD_TO_PENDING_COLLECTION',
        payload: datasetID,
      });
    } else if (USE_SINGLE_CITY) {
      dispatch({
        type: 'ADD_TO_CURRENT_COLLECTION',
        payload: datasetID,
      });
    } else {
      // Adds to existing collection on the backend
      addTo({
        variables: { id: state.activeCollectionID, datasetIds: [datasetID] },
      });
    }
  };

  const removeFromCurrentCollection = datasetID => {
    if (state.activeCollectionID === 'pending') {
      dispatch({
        type: 'REMOVE_FROM_PENDING_COLLECTION',
        payload: datasetID,
      });
    } else if (USE_SINGLE_CITY) {
      // TODO: this should remove dataset from the backend once multi-city
      // db is ready
      dispatch({
        type: 'REMOVE_FROM_CURRENT_COLLECTION',
        payload: datasetID,
      });
    }
  };

  const createCollectionFromPending = ({
    id,
    name,
    description,
    datasetIds,
  }) => {
    if (state.activeCollectionID === 'pending') {
      console.log('DATASET IDS', datasetIds);
      dispatch({
        type: 'CREATE_FROM_PENDING_COLLECTION',
        payload: {
          id,
          name,
          description,
          datasetIds,
          createdAt: new Date(),
        },
      });
    }
  };

  const createEmptyCollection = ({ id, name, description }) => {
    dispatch({
      type: 'CREATE_EMPTY_COLLECTION',
      payload: {
        id,
        name,
        description,
        datasetIds: [],
        createdAt: new Date(),
      },
    });
  };

  return [
    combinedState,
    {
      addToCurrentCollection,
      removeFromCurrentCollection,
      inCurrentCollection,
      createCollectionFromPending,
      createEmptyCollection,
      setActiveCollection,
    },
  ];
}