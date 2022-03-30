import { useCallback, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useCreateCollection } from '../../hooks/graphQLAPI';
import { useUserCollections } from '../../hooks/collections';
import useCurrentUser from '../../auth/useCurrentUser';

/**
 * Create a collection in the backend if the user is authenticated. Otherwise,
 * create the collection in the browser cache.
 */
export default function useCollectionCreation(): [
  (name: string, description: string) => Promise<string>,
  boolean,
] {
  const { isAuthenticated } = useCurrentUser();
  const [isCreating, setIsCreating] = useState(false);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore TODO: remove this ts-ignore
  const [, { createEmptyCollection }] = useUserCollections();
  const [createCollection] = useCreateCollection();

  const createCollectionFn = useCallback(
    async (name: string, description: string): Promise<string> => {
      setIsCreating(true);

      let collectionId;
      if (isAuthenticated) {
        const result = await createCollection({
          variables: {
            name,
            description,
            datasetIds: [],
          },
        });
        collectionId = result.data.createCollection.id;
      } else {
        collectionId = uuidv4();
      }

      createEmptyCollection({
        id: collectionId,
        name,
        description,
        datasetIds: [],
      });

      setIsCreating(false);
      return collectionId;
    },
    [isAuthenticated, createCollection, createEmptyCollection],
  );

  return [createCollectionFn, isCreating];
}
