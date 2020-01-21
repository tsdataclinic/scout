import { useCollectionsValue } from '../contexts/CollectionsContext';

export default function useCollection() {
  const [state, dispatch] = useCollectionsValue();
  const addToCollection = (datasetID) =>
    dispatch({ type: 'ADD_TO_COLLECTION', payload: datasetID });
  const removeFromCollection = (datasetID) =>
    dispatch({ type: 'REMOVE_FROM_COLLECTION', payload: datasetID });
  const setName = (name) => dispatch({ type: 'SET_NAME', payload: name });
  return [state, { addToCollection, removeFromCollection, setName }];
}
