import React, {createContext, useContext, useReducer, useEffect} from 'react';
import {getManifest, getCategories, getTagList} from '../utils/socrata';

export const AppContext = createContext();

const initalState = {
  datasets: [],
  tagList: [],
  categories: [],
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
    default:
      return state;
  }
};

export const StateProvider = ({children}) => {
  const [state, dispatch] = useReducer(reducer, initalState);

  useEffect(() => {
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
    });
  }, []);

  useEffect(() => {
    console.log('State updated ', state);
  }, [state]);

  return (
    <AppContext.Provider value={[state, dispatch]}>
      {children}
    </AppContext.Provider>
  );
};

export const useStateValue = () => useContext(AppContext);
