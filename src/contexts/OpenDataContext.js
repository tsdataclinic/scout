import React, {createContext, useContext, useReducer, useEffect} from 'react';
import {getManifest, getCategories, getTagList} from '../utils/socrata';

export const AppContext = createContext();

const initalState = {
  datasets: [],
  tagList: [],
  categories: [],
  stateLoaded: false,
};

const reducer = (state, action) => {
  const {type, payload} = action;
  switch (type) {
    case 'UPDATE_OPEN_DATASET_MANIFEST':
      return {...state, datasets: payload};
    case 'UPDATE_TAGS':
      return {...state, tagList: payload};
    case 'UPDATE_CATEGORIES':
      return {...state, categories: payload};
    case 'HYDRATE_STATE':
      return {...state, ...payload};
    case 'SET_LOADED':
      return {...state, stateLoaded: true};
    default:
      return state;
  }
};

export const StateProvider = ({children}) => {
  const [state, dispatch] = useReducer(reducer, initalState);

  useEffect(() => {
    const storedState = localStorage.getItem('seralizedState');
    if (storedState) {
      dispatch({
        type: 'HYDRATE_STATE',
        payload: {...JSON.parse(storedState), stateLoaded: true},
      });
    } else {
      getManifest().then(result => {
        const tagList = getTagList(result);
        const categories = getCategories(result);
        dispatch({
          type: 'UPDATE_OPEN_DATASET_MANIFEST',
          payload: result,
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
          payload: true,
        });
      });
    }
  }, []);

  useEffect(() => {
    console.log('State updated ', state);
    if (state.stateLoaded) {
      console.log('PERSISTING');
      const {datasets, tagList, categories} = state;
      //localStorage.setItem(
      //      'storedState',
      //      JSON.stringify({datasets, tagList, categories}),
      //    );
    }
  }, [state]);

  return (
    <AppContext.Provider value={[state, dispatch]}>
      {children}
    </AppContext.Provider>
  );
};

export const useStateValue = () => useContext(AppContext);
