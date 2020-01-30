import React, { createContext, useContext, useReducer, useEffect } from 'react';
import Dexie from 'dexie';

export const CollectionsContext = createContext();

const initalState = {
  datasets: [],
  name: null,
  cacheLoaded: false,
};

const db = new Dexie('CollectionCache');
db.version(1).stores({
  CollectionCache: 'id',
});

const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'ADD_TO_COLLECTION':
      return { ...state, datasets: [...state.datasets, payload] };
    case 'REMOVE_FROM_COLLECTION':
      return {
        ...state,
        datasets: state.datasets.filter((d) => d !== payload),
      };
    case 'SET_NAME':
      return {
        ...state,
        name: payload,
      };
    case 'CLEAR_COLLECTION':
      return {
        ...state,
        datasets: [],
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

export const CollectionsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initalState);
  const { cacheLoaded, datasets, name } = state;

  // Restore state
  useEffect(() => {
    db.CollectionCache.get(1).then((result) => {
      if (result) {
        const cachedState = JSON.parse(result.data);
        dispatch({
          type: 'HYDRATE_STATE',
          payload: { ...initalState, ...cachedState, cacheLoaded: true },
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
          datasets,
          name,
        }),
        id: 1,
      });
    }
  }, [cacheLoaded, datasets, name]);

  return (
    <CollectionsContext.Provider value={[state, dispatch]}>
      {children}
    </CollectionsContext.Provider>
  );
};

export const useCollectionsValue = () => useContext(CollectionsContext);
