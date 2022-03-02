import React, { createContext, useContext, useReducer, useEffect } from 'react';
import Dexie from 'dexie';

export const CollectionsContext = createContext();

// A collection has the form
// datasetIDs: array of dataset ids
// name : the name of the collection
// id : a random id for the collection
// description : short 255 character description of the collection
//
const initalState = {
  // array of datasets to add to the pending collection
  pendingCollection: [],
  activeCollectionID: 'pending',
};

const db = new Dexie('CollectionCache');
db.version(1).stores({
  CollectionCache: 'id',
});

const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'SET_ACTIVE_COLLECTION':
      return {
        ...state,
        activeCollectionID: payload,
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
        collections: (state.collections || []).map(c =>
          c.id === state.activeCollectionID
            ? {
                ...c,
                datasetIDs: c.datasetIDs.concat(payload),
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
        collections: (state.collections || []).map(c =>
          c.id === state.activeCollectionID
            ? {
                ...c,
                datasetIDs: c.datasetIDs.filter(id => id !== payload),
              }
            : c,
        ),
      };

    case 'CREATE_FROM_PENDING_COLLECTION':
    case 'CREATE_EMPTY_COLLECTION':
      return {
        ...state,
        pendingCollection: [],
        activeCollectionID: payload.id,
        collections: [...(state.collections || []), payload],
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
  const [state, dispatch] = useReducer(reducer, initalState);
  const { cacheLoaded, collections, activeCollectionID, pendingCollection } =
    state;

  // Restore state
  useEffect(() => {
    db.CollectionCache.get(1).then(result => {
      if (result) {
        const cachedState = JSON.parse(result.data);
        dispatch({
          type: 'HYDRATE_STATE',
          payload: {
            ...initalState,
            ...cachedState,
            cacheLoaded: true,
          },
        });
      } else {
        dispatch({
          payload: { ...initalState, cacheLoaded: true },
          type: 'HYDRATE_STATE',
        });
      }
    });
  }, []);

  // Cache state
  useEffect(() => {
    if (cacheLoaded) {
      db.CollectionCache.put({
        data: JSON.stringify({
          collections,
          activeCollectionID,
          pendingCollection,
        }),
        id: 1,
      });
    }
  }, [cacheLoaded, collections, activeCollectionID, pendingCollection]);

  const context = React.useMemo(() => [state, dispatch], [state, dispatch]);

  return (
    <CollectionsContext.Provider value={context}>
      {children}
    </CollectionsContext.Provider>
  );
}

export const useCollectionsValue = () => useContext(CollectionsContext);
