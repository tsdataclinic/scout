import { useCallback, useState } from 'react';
import { useUserCollections } from '../../hooks/collections';

/**
 * Create a collection in the backend if the user is authenticated. Otherwise,
 * create the collection in the browser cache.
 */
export default function useCollectionCreation(): [
  (name: string, description: string) => Promise<string>,
  boolean,
] {
  const [isCreating, setIsCreating] = useState(false);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore TODO: remove this ts-ignore
  const [, { createEmptyCollection }] = useUserCollections();

  const createCollectionFn = useCallback(
    async (name: string, description: string): Promise<string> => {
      setIsCreating(true);
      const collectionId = await createEmptyCollection({
        name,
        description,
      });

      setIsCreating(false);
      return collectionId;
    },
    [createEmptyCollection],
  );

  return [createCollectionFn, isCreating];
}
