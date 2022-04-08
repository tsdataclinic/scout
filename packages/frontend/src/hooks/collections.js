import { v4 as uuidv4 } from 'uuid';
import { useCollectionsValue } from '../contexts/CollectionsContext';
import {
  useAddToCollection,
  useCurrentUserCollections,
  useRemoveDatasetFromCollection,
  useCreateCollection,
} from './graphQLAPI';
import useCurrentUser from '../auth/useCurrentUser';

export function useUserCollections() {
  const { isAuthenticated } = useCurrentUser();

  // TODO: This function gets triggered 40+ times on each refresh. This does
  // not seem very performant
  const [state, dispatch] = useCollectionsValue();
  const { data, loading: loadingCollections } = useCurrentUserCollections();

  // TODO: we shouldn't need to query the server here. We should be able
  // to safely assume that whatever is in the global state is the most
  // up-to-date data
  const serverCollections = data
    ? data?.profile?.collections.map(col => ({
        id: col.id,
        name: col.name,
        description: col.description,
        datasetIds: col.datasets.map(d => d.id),
      }))
    : [];

  const [createCollection] = useCreateCollection();
  const [addTo] = useAddToCollection();
  const [removeFrom] = useRemoveDatasetFromCollection();

  const localOrServerCollections = isAuthenticated
    ? serverCollections
    : state.collections || [];

  const combinedState = {
    loadingCollections,
    activePortalAbbreviation: state.activePortalAbbreviation,
    collections: localOrServerCollections,
    globalPortalsAreActive: state.globalPortalsAreActive,
  };

  const addToCollection = async (datasetId, collectionId) => {
    if (!isAuthenticated) {
      // add to the current collection locally
      dispatch({
        type: 'ADD_TO_COLLECTION',
        payload: { datasetId, collectionId },
      });
    } else {
      // Adds to existing collection on the backend
      addTo({
        variables: {
          id: collectionId,
          datasetIds: [datasetId],
        },
      });
    }
  };

  const removeFromCollection = (datasetId, collectionId) => {
    if (!isAuthenticated) {
      // add to the current collection locally
      dispatch({
        type: 'REMOVE_FROM_COLLECTION',
        payload: { datasetId, collectionId },
      });
    } else {
      // remove from existing collection on the backend
      removeFrom({
        variables: {
          datasetId,
          collectionId,
        },
      });
    }
  };

  // create an empty collection in the backend if authenticated,
  // otherwise create an empty collection only in local state
  const createEmptyCollection = async ({ name, description }) => {
    let collectionId;

    if (isAuthenticated) {
      const result = await createCollection({
        variables: {
          name,
          description,
          datasetIds: [],
        },
      });
      collectionId = result.data.createCollection.id;
    } else {
      collectionId = uuidv4();
    }

    dispatch({
      type: 'CREATE_EMPTY_COLLECTION',
      payload: {
        collection: {
          name,
          description,
          id: collectionId,
          datasetIds: [],
          createdAt: new Date(),
        },
      },
    });

    return collectionId;
  };

  return [
    combinedState,
    {
      addToCollection,
      removeFromCollection,
      createEmptyCollection,
    },
  ];
}
