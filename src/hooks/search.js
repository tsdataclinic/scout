import { useSearchState } from '../contexts/SearchContext';

export function useSelectedTags() {
  const [{ tags }, dispatch] = useSearchState();
  const setSelectedTags = (newTags) => {
    dispatch({
      type: 'SET_TAGS',
      payload: newTags,
    });
  };
  return [tags, setSelectedTags];
}

export function useSelectedCategories() {
  const [{ categories }, dispatch] = useSearchState();
  const setSelectedCategories = (newCategories) => {
    dispatch({
      type: 'SET_CATEGORIES',
      payload: newCategories,
    });
  };
  return [categories, setSelectedCategories];
}

export function useSelectedColumns() {
  const [{ columns }, dispatch] = useSearchState();
  const setSelectedColumns = (newColumns) => {
    dispatch({
      type: 'SET_COLUMNS',
      payload: newColumns,
    });
  };
  return [columns, setSelectedColumns];
}

export function useSelectedDepartments() {
  const [{ departments }, dispatch] = useSearchState();
  const setSelectedDepartments = (newDepartments) => {
    dispatch({
      type: 'SET_DEPARTMENTS',
      payload: newDepartments,
    });
  };
  return [departments, setSelectedDepartments];
}

export function useSearchTerm() {
  const [{ term }, dispatch] = useSearchState();
  const setSearchTerm = (newTerm) => {
    dispatch({
      type: 'SET_TERM',
      payload: newTerm,
    });
  };
  return [term, setSearchTerm];
}

export function useSortVariable() {
  const [{ sortVariable }, dispatch] = useSearchState();
  const setSortVariable = (newSortVariable) => {
    dispatch({
      type: 'SET_SORT_VARIABLE',
      payload: newSortVariable,
    });
  };
  return [sortVariable, setSortVariable];
}
export function useSortOrder() {
  const [{ sortOrder }, dispatch] = useSearchState();
  const setSearchTerm = (newSortOrder) => {
    dispatch({
      type: 'SET_SORT_ORDER',
      payload: newSortOrder,
    });
  };
  return [sortOrder, setSearchTerm];
}
