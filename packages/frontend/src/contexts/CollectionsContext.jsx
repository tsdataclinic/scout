import React, { createContext, useContext, useReducer, useEffect } from 'react';
import Dexie from 'dexie';
import useCurrentUser from '../auth/useCurrentUser';
import { useCurrentUserCollections } from '../hooks/graphQLAPI';
import { DEFAULT_PORTAL } from '../portals';

export const CollectionsContext = createContext();

/**
 * A collection has the form
 * - datasetIds: array of dataset ids
 * - name : the name of the collection
 * - id : a random id for the collection
 * - description : short 255 character description of the collection
 */
const initialState = {
  activePortalAbbreviation: DEFAULT_PORTAL,
  globalPortalsAreActive: false,

  // array of datasets to add to the pending collection
  pendingCollection: [],
  activeCollectionId: 'pending',
  hydratedData: false,
  collections: [],
};

const db = new Dexie('CollectionCache');
db.version(1).stores({
  CollectionCache: 'id',
});

const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'PORTAL_SET_ACTIVE':
      return {
        ...state,
        activePortalAbbreviation: payload.activePortalAbbreviation,
      };
    case 'PORTAL_SET_GLOBAL':
      return {
        ...state,
        globalPortalsAreActive: payload.isGlobal,
      };

    case 'SET_ACTIVE_COLLECTION':
      return {
        ...state,
        activeCollectionId: payload,
      };

    case 'ADD_TO_PENDING_COLLECTION': {
      return {
        ...state,
        pendingCollection: [...state.pendingCollection, payload],
      };
    }

    case 'ADD_TO_CURRENT_COLLECTION': {
      return {
        ...state,
        collections: state.collections.map(c =>
          c.id === state.activeCollectionId
            ? {
                ...c,
                datasetIds: c.datasetIds.concat(payload),
              }
            : c,
        ),
      };
    }

    case 'REMOVE_FROM_PENDING_COLLECTION':
      return {
        ...state,
        pendingCollection: state.pendingCollection.filter(
          dID => dID !== payload,
        ),
      };

    case 'REMOVE_FROM_CURRENT_COLLECTION':
      return {
        ...state,
        collections: state.collections.map(c =>
          c.id === state.activeCollectionId
            ? {
                ...c,
                datasetIds: c.datasetIds.filter(id => id !== payload),
              }
            : c,
        ),
      };

    case 'CREATE_FROM_PENDING_COLLECTION':
    case 'CREATE_EMPTY_COLLECTION':
      return {
        ...state,
        pendingCollection: [],
        activeCollectionId: payload.id,
        collections: [...state.collections, payload],
      };

    case 'HYDRATE_STATE':
      return {
        ...state,
        ...payload,
      };
    default:
      return state;
  }
};

export function CollectionsProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    activePortalAbbreviation,
    globalPortalsAreActive,
    hydratedData,
    collections,
    activeCollectionId,
    pendingCollection,
  } = state;
  const { isAuthenticated } = useCurrentUser();
  const { data: collectionsFromDB, loading: areCollectionsLoading } =
    useCurrentUserCollections();

  // Restore state on mount
  useEffect(() => {
    async function hydrateFromLocalCache() {
      const result = await db.CollectionCache.get(1);
      if (result) {
        const cachedState = JSON.parse(result.data);
        dispatch({
          type: 'HYDRATE_STATE',
          payload: {
            ...initialState,
            ...cachedState,
            hydratedData: true,
          },
        });
      } else {
        dispatch({
          payload: { ...initialState, hydratedData: true },
          type: 'HYDRATE_STATE',
        });
      }
    }

    async function hydrateFromAPI() {
      if (!areCollectionsLoading) {
        const initialCollections =
          collectionsFromDB?.profile.collections.map(col => ({
            id: col.id,
            name: col.name,
            description: col.description,
            datasetIds: col.datasets.map(d => d.id),
          })) || [];

        // we still need to load cached data, because there can be things here
        // that can help us in hydrating the data
        const cachedData = await db.CollectionCache.get(1);
        const cachedState = cachedData ? JSON.parse(cachedData.data) : {};

        let initialActiveCollectionId = 'pending';
        let initialPendingCollection = [];

        // if there are no collections in our db, then let's take the
        // cached pending collection as our starting point
        if (initialCollections.length === 0 && cachedState.pendingCollection) {
          initialPendingCollection = cachedState.pendingCollection;
        }

        // if we have at least one collection then we can make a smarter
        // choice for our starting activeCollectionId
        if (initialCollections.length > 0) {
          const cachedActiveCollectionId = cachedState.activeCollectionId || '';

          // check if the cached activeCollectionId is a valid id
          if (initialCollections.some(c => c.id === cachedActiveCollectionId)) {
            initialActiveCollectionId = cachedActiveCollectionId;
          } else {
            initialActiveCollectionId = initialCollections[0].id;
          }
        }

        dispatch({
          type: 'HYDRATE_STATE',
          payload: {
            ...initialState,
            activeCollectionId: initialActiveCollectionId,
            pendingCollection: initialPendingCollection,
            hydratedData: true,
          },
        });
      }
    }

    if (!hydratedData) {
      if (isAuthenticated) {
        hydrateFromAPI();
      } else {
        hydrateFromLocalCache();
      }
    }
  }, [
    isAuthenticated,
    hydratedData,
    collectionsFromDB,
    activeCollectionId,
    areCollectionsLoading,
  ]);

  // Cache state
  useEffect(() => {
    if (hydratedData) {
      db.CollectionCache.put({
        data: JSON.stringify({
          activePortalAbbreviation,
          activeCollectionId,
          collections,
          globalPortalsAreActive,
          pendingCollection,
        }),
        id: 1,
      });
    }
  }, [
    activePortalAbbreviation,
    globalPortalsAreActive,
    hydratedData,
    collections,
    activeCollectionId,
    pendingCollection,
  ]);

  const context = React.useMemo(() => [state, dispatch], [state, dispatch]);

  return (
    <CollectionsContext.Provider value={context}>
      {children}
    </CollectionsContext.Provider>
  );
}

export const useCollectionsValue = () => useContext(CollectionsContext);
