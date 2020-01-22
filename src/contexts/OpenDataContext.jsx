import React, { createContext, useContext, useReducer, useEffect } from 'react';
import Dexie from 'dexie';
import { getManifest, getCategories, getTagList } from '../utils/socrata';

const db = new Dexie('SocrataCache');
db.version(1).stores({
  SocrataCache: 'id',
});

export const AppContext = createContext();

const initalState = {
  datasets: [],
  tagList: [],
  categories: [],
  stateLoaded: false,
};

const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'UPDATE_OPEN_DATASET_MANIFEST':
      return { ...state, datasets: payload };
    case 'UPDATE_TAGS':
      return { ...state, tagList: payload };
    case 'UPDATE_CATEGORIES':
      return { ...state, categories: payload };
    case 'HYDRATE_STATE':
      return { ...state, ...payload };
    case 'SET_LOADED':
      return { ...state, stateLoaded: true };
    default:
      return state;
  }
};

export const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initalState);

  // Try to get the state locally from indexed db... if we can't find it there, request it from the
  // socrata API

  useEffect(() => {
    db.SocrataCache.get(1).then((result) => {
      if (result) {
        const cachedState = JSON.parse(result.data);
        dispatch({
          type: 'HYDRATE_STATE',
          payload: { ...initalState, ...cachedState, cache_loaded: true },
        });
      } else {
        getManifest().then((manifest) => {
          const tagList = getTagList(manifest);
          const categories = getCategories(manifest);
          dispatch({
            type: 'UPDATE_OPEN_DATASET_MANIFEST',
            payload: manifest,
          });
          dispatch({
            type: 'UPDATE_TAGS',
            payload: tagList,
          });
          dispatch({
            type: 'UPDATE_CATEGORIES',
            payload: categories,
          });
          dispatch({
            type: 'SET_LOADED',
          });
        });
      }
    });
  }, []);

  // If our datasets change, update the cahced version
  const { datasets, tagList, categories, stateLoaded } = state;
  useEffect(() => {
    if (stateLoaded) {
      db.SocrataCache.put({
        data: JSON.stringify({
          datasets,
          tagList,
          categories,
        }),
        id: 1,
      });
    }
  }, [datasets, tagList, categories, stateLoaded]);

  return (
    <AppContext.Provider value={[state, dispatch]}>
      {children}
    </AppContext.Provider>
  );
};

export const useStateValue = () => useContext(AppContext);
