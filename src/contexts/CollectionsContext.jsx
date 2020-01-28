import React, { createContext, useContext, useReducer } from 'react';

export const CollectionsContext = createContext();

const initalState = {
  datasets: [],
  name: null,
};

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
    default:
      return state;
  }
};

export const CollectionsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initalState);

  return (
    <CollectionsContext.Provider value={[state, dispatch]}>
      {children}
    </CollectionsContext.Provider>
  );
};

export const useCollectionsValue = () => useContext(CollectionsContext);
