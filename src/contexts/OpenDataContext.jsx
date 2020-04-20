import React, { createContext, useContext, useReducer, useEffect } from 'react';

import Dexie from 'dexie';
import {
  getManifest,
  getCategories,
  getColumns,
  getTagList,
  getDepartments,
} from '../utils/socrata';

const db = new Dexie('SocrataCache');
db.version(1).stores({
  SocrataCache: 'id',
});

export const AppContext = createContext();

const initalState = {
  datasets: [],
  tagList: [],
  categories: [],
  departments: [],
  columns: [],
  stateLoaded: false,
  lastUpdated: null,
};

const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'UPDATE_OPEN_DATASET_MANIFEST':
      return {
        ...state,
        datasets: payload.datasets,
        lastUpdated: payload.lastUpdated,
      };
    case 'UPDATE_TAGS':
      return { ...state, tagList: payload };
    case 'UPDATE_CATEGORIES':
      return { ...state, categories: payload };
    case 'UPDATE_COLUMNS':
      return { ...state, columns: payload };
    case 'UPDATE_DEPARTMENTS':
      return { ...state, departments: payload };
    case 'HYDRATE_STATE':
      return { ...state, ...payload };
    case 'SET_LOADED':
      return { ...state, stateLoaded: true };
    default:
      return state;
  }
};

const updateManifestFromSocrata = (dispatch) => {
  getManifest().then((manifest) => {
    const tagList = getTagList(manifest);
    const categories = getCategories(manifest);
    const departments = getDepartments(manifest);
    const columns = getColumns(manifest);
    dispatch({
      type: 'UPDATE_OPEN_DATASET_MANIFEST',
      payload: {
        datasets: manifest,
        lastUpdated: new Date(),
      },
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
      type: 'UPDATE_DEPARTMENTS',
      payload: departments,
    });
    dispatch({
      type: 'UPDATE_COLUMNS',
      payload: columns,
    });
    dispatch({
      type: 'SET_LOADED',
    });
  });
};

// Checks to see if the cache is older than 1 daym if so update it
const shouldUpdateCache = (lastUpdated) => {
  if (lastUpdated == null) return true;
  if ((new Date() - lastUpdated) / 1000 > 24 * 60 * 60) return true;
  return false;
};

export const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initalState);

  // Try to get the state locally from indexed db... if we can't find it there, request it from the
  // socrata API
  //
  //
  useEffect(() => {
    console.log('state is ', state);
  }, [state]);

  useEffect(() => {
    db.SocrataCache.get(1).then((result) => {
      if (result) {
        const cachedState = JSON.parse(result.data);

        if (shouldUpdateCache(new Date(cachedState.lastUpdated))) {
          updateManifestFromSocrata(dispatch);
        } else {
          dispatch({
            type: 'HYDRATE_STATE',
            payload: {
              ...initalState,
              ...cachedState,
              cache_loaded: true,
            },
          });
          // Set state as loaded to indicate that data is ready to use
          dispatch({
            type: 'SET_LOADED',
          });
        }
      } else {
        updateManifestFromSocrata(dispatch);
      }
    });
  }, []);

  // If our datasets change, update the cahced version
  const {
    datasets,
    tagList,
    columns,
    categories,
    departments,
    stateLoaded,
    lastUpdated,
  } = state;
  useEffect(() => {
    if (stateLoaded) {
      db.SocrataCache.put({
        data: JSON.stringify({
          datasets,
          tagList,
          categories,
          departments,
          columns,
          lastUpdated,
        }),
        id: 1,
      });
    }
  }, [
    datasets,
    tagList,
    categories,
    columns,
    departments,
    stateLoaded,
    lastUpdated,
  ]);

  return (
    <AppContext.Provider value={[state, dispatch]}>
      {children}
    </AppContext.Provider>
  );
};

export const useStateValue = () => useContext(AppContext);
