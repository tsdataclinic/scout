import { useIsAuthenticated } from '@azure/msal-react';
import { useCollectionsValue } from '../contexts/CollectionsContext';
import {
  useAddToCollection,
  useCurrentUserCollections,
  useDatasetsFromIds,
} from './graphQLAPI';

export function useUserCollections() {
  const isAuthenticated = useIsAuthenticated();

  // TODO: This function gets triggered 40+ times on each refresh. This does
  // not seem very performant
  const [state, dispatch] = useCollectionsValue();
  const { data } = useCurrentUserCollections();
  const { data: pendingDatasets } = useDatasetsFromIds(state.pendingCollection);
  const serverCollections = data
    ? data.profile.collections.map(col => ({
        id: col.id,
        name: col.name,
        description: col.description,
        datasetIds: col.datasets.map(d => d.id),
      }))
    : [];
  const [addTo] = useAddToCollection();

  const localOrServerCollections = isAuthenticated
    ? serverCollections
    : state.collections || [];

  const activeNonPendingCollection = localOrServerCollections.find(
    c => c.id === state.activeCollectionId,
  );

  const { data: collectionDatasets } = useDatasetsFromIds(
    activeNonPendingCollection ? activeNonPendingCollection.datasetIds : [],
  );

  const combinedState = {
    activeCollectionId: state.activeCollectionId,
    collections: localOrServerCollections,
    activeCollection:
      state.activeCollectionId === 'pending'
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
    if (state.activeCollectionId === 'pending') {
      return state.pendingCollection.includes(id);
    }

    if (serverCollections) {
      const collection = serverCollections.find(
        c => c.id === state.activeCollectionId,
      );
      if (collection) {
        return collection.datasetIds.includes(id);
      }
      return false;
    }

    if (state.collections) {
      const currentCollection = state.collections.find(
        c => c.id === state.activeCollectionId,
      );

      return currentCollection
        ? currentCollection.datasetIds.includes(id)
        : false;
    }

    return false;
  };

  const addToCurrentCollection = async datasetId => {
    if (state.activeCollectionId === 'pending') {
      // the collection doesn't exist in the backend yet, so we just have
      // to add to the collection in-browser.
      dispatch({
        type: 'ADD_TO_PENDING_COLLECTION',
        payload: datasetId,
      });
    } else if (!isAuthenticated) {
      // add to the current collection locally
      dispatch({
        type: 'ADD_TO_CURRENT_COLLECTION',
        payload: datasetId,
      });
    } else {
      // Adds to existing collection on the backend
      addTo({
        variables: { id: state.activeCollectionId, datasetIds: [datasetId] },
      });
    }
  };

  const removeFromCurrentCollection = datasetId => {
    if (state.activeCollectionId === 'pending') {
      dispatch({
        type: 'REMOVE_FROM_PENDING_COLLECTION',
        payload: datasetId,
      });
    } else if (!isAuthenticated) {
      // add to the current collection locally
      dispatch({
        type: 'REMOVE_FROM_CURRENT_COLLECTION',
        payload: datasetId,
      });
    }
    // TODO: add backend remove
  };

  const createCollectionFromPending = ({
    id,
    name,
    description,
    datasetIds,
  }) => {
    if (state.activeCollectionId === 'pending') {
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
