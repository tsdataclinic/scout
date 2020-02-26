import React, { createContext, useContext, useReducer } from 'react';

export const SearchContext = createContext();

const initalState = {
  term: '',
  tags: [],
  categories: [],
  departments: [],
  columns: [],
  sortVariable: 'name',
  sortOrder: 'asc',
  collapseFilters: true,
  collapsedFilterList: {
    categories: true,
    tags: true,
    departments: true,
    columns: true,
  },
};

const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'ADD_TAG':
      return { ...state, tags: [...state.tags, payload] };
    case 'REMOVE_TAG':
      return { ...state, tags: state.tags.filter((t) => t !== payload) };
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, payload] };
    case 'REMOVE_CATEGORY':
      return {
        ...state,
        category: state.category.filter((t) => t !== payload),
      };
    case 'ADD_COLUMN':
      return { ...state, columns: [...state.columns, payload] };
    case 'REMOVE_COLUMN':
      return {
        ...state,
        columns: state.columns.filter((t) => t !== payload),
      };
    case 'ADD_DEPARTMNET':
      return { ...state, departments: [...state.departments, payload] };
    case 'REMOVE_DEPARTMENT':
      return {
        ...state,
        departments: state.departments.filter((t) => t !== payload),
      };
    case 'CLEAR':
      return initalState;
    case 'SET_TAGS':
      return { ...state, tags: payload };
    case 'SET_DEPARTMENTS':
      return { ...state, departments: payload };
    case 'SET_CATEGORIES':
      return { ...state, categories: payload };
    case 'SET_COLUMNS':
      return { ...state, columns: payload };
    case 'SET_SORT_ORDER':
      return { ...state, sortOrder: payload };
    case 'SET_COLLAPSE_FILTER_BAR':
      return { ...state, collapseFilters: payload };
    case 'SET_FILTER_STATE':
      return {
        ...state,
        collapsedFilterList: {
          ...state.collapsedFilterList,
          [payload.filter]: payload.state,
        },
      };
    case 'SET_SORT_VARIABLE':
      return { ...state, sortVariable: payload };
    case 'SET_TERM':
      return { ...state, term: payload };
    default:
      return state;
  }
};

export const SearchProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initalState);

  return (
    <SearchContext.Provider value={[state, dispatch]}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchState = () => useContext(SearchContext);
