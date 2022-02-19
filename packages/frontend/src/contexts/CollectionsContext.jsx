import React, { createContext, useContext, useReducer, useEffect } from 'react';
import Dexie from 'dexie';

export const CollectionsContext = createContext();

// A collection has the form
// datasets : array of dataset ids
// name : the name of the collection
// id : a random id for the collection
// description : short 255 character description of the collection
//
const initalState = {
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

    case 'CLEAR_PENDING_COLLECTION':
      return {
        ...state,
        collections: [
          ...state.collections,
          {
            ...state.collections.find((c) => c.id === 'pending'),
            id: payload.id,
            createdAt: new Date(),
            name: payload.name,
          },
        ].map((c) =>
          c.id === 'pending'
            ? { id: 'pending', datasets: [], name: 'pending' }
            : c,
        ),
      };
    case 'ADD_TO_PENDING_COLLECTION':
      return {
        ...state,
        pendingCollection: [...state.pendingCollection, payload],
      };
    case 'REMOVE_FROM_PENDING_COLLECTION':
      return {
        ...state,
        pendingCollection: state.pendingCollection.filter(
          (dID) => dID !== payload,
        ),
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
  const { cacheLoaded, collections, activeCollectionID } = state;

  // Restore state
  useEffect(() => {
    db.CollectionCache.get(1).then((result) => {
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
        }),
        id: 1,
      });
    }
  }, [cacheLoaded, collections, activeCollectionID]);

  const context = React.useMemo(() => [state, dispatch], [state, dispatch]);

  return (
    <CollectionsContext.Provider value={context}>
      {children}
    </CollectionsContext.Provider>
  );
}

export const useCollectionsValue = () => useContext(CollectionsContext);
