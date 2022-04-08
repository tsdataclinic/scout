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
 * - createdAt: the date the collection is created
 */
const initialState = {
  activePortalAbbreviation: DEFAULT_PORTAL,
  globalPortalsAreActive: false,
  collections: [],
  hydratedData: false,
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

    case 'ADD_TO_COLLECTION': {
      return {
        ...state,
        collections: state.collections.map(c =>
          c.id === payload.collectionId
            ? {
                ...c,
                datasetIds: c.datasetIds.concat(payload.datasetId),
              }
            : c,
        ),
      };
    }

    case 'REMOVE_FROM_COLLECTION':
      return {
        ...state,
        collections: state.collections.map(c =>
          c.id === payload.collectionId
            ? {
                ...c,
                datasetIds: c.datasetIds.filter(id => id !== payload.datasetId),
              }
            : c,
        ),
      };

    case 'DELETE_COLLECTION':
      return {
        ...state,
        collections: state.collections.filter(
          c => c.id !== payload.collectionId,
        ),
      };

    case 'CREATE_EMPTY_COLLECTION':
      return {
        ...state,
        collections: [...state.collections, payload.collection],
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
            activePortalAbbreviation: cachedState.activePortalAbbreviation,

            // scrub the 'pending' collection in case it was left in the cache
            collections: cachedState.collections.filter(
              c => c.id !== 'pending',
            ),
            globalPortalsAreActive: cachedState.globalPortalsAreActive,
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

    if (!hydratedData) {
      if (isAuthenticated) {
        dispatch({
          type: 'HYDRATE_STATE',
          payload: {
            ...initialState,
            hydratedData: true,
          },
        });
      } else {
        hydrateFromLocalCache();
      }
    }
  }, [isAuthenticated, hydratedData, collectionsFromDB, areCollectionsLoading]);

  // Cache state
  useEffect(() => {
    if (hydratedData) {
      db.CollectionCache.put({
        data: JSON.stringify({
          activePortalAbbreviation,
          collections,
          globalPortalsAreActive,
        }),
        id: 1,
      });
    }
  }, [
    activePortalAbbreviation,
    globalPortalsAreActive,
    hydratedData,
    collections,
  ]);

  const context = React.useMemo(() => [state, dispatch], [state, dispatch]);

  return (
    <CollectionsContext.Provider value={context}>
      {children}
    </CollectionsContext.Provider>
  );
}

export const useCollectionsValue = () => useContext(CollectionsContext);
