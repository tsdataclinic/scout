import { useCallback, useEffect, useState } from 'react';
import { useUserCollections } from '../../hooks/collections';
import { CollectionTabCreate } from './CollectionTabCreate';
import { CollectionTabSwitch } from './CollectionTabSwitch';
import { CollectionTabAdd } from './CollectionTabAdd';
import './CollectionTab.scss';
import CollectionTabList from './CollectionTabList';

export function usePreventCollectionTabBlur() {
  // prevent the collection tab blur
  // TODO: ideally we should have a global context that tells us if the
  // CollectionTab is open, and only if it is then we stop the bubbling of
  // the event
  return useCallback(event => {
    event.stopPropagation();
  }, []);
}

function useDismissOnBlur(onDismiss) {
  useEffect(() => {
    const onDocumentClick = () => {
      onDismiss();
    };
    document.addEventListener('click', onDocumentClick);

    return () => {
      document.removeEventListener('click', onDocumentClick);
    };
  }, [onDismiss]);

  return usePreventCollectionTabBlur();
}

export default function CollectionTab({ visible, onDismiss }) {
  const preventCollectionTabBlur = useDismissOnBlur(onDismiss);

  const [
    { activeCollection, collections, activeCollectionId },
    { setActiveCollection },
  ] = useUserCollections();

  const [tab, setTab] = useState('list');

  const onCreate = () => {
    setTab('create');
  };

  const onCollectionCreated = collectionId => {
    if (collectionId) {
      setActiveCollection(collectionId);
    }
    setTab('list');
  };

  if (!visible) {
    return '';
  }

  return (
    // Safe to disable
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
    <div className="collection-tab" onClick={preventCollectionTabBlur}>
      {tab === 'list' ? (
        <CollectionTabList
          collections={collections}
          onDismiss={onDismiss}
          onCreate={onCreate}
        />
      ) : null}

      {tab === 'create' && (
        <CollectionTabCreate
          isPending={activeCollection.id === 'pending'}
          datasetIds={activeCollection.datasets.map(d => d.id)}
          onDone={onCollectionCreated}
        />
      )}

      {tab === 'add' && activeCollectionId && (
        <CollectionTabAdd
          onSwitch={() => setTab('switch')}
          collectionId={activeCollectionId}
          onDismiss={onDismiss}
          onCreate={onCreate}
        />
      )}
      {tab === 'switch' && (
        <CollectionTabSwitch onSwitch={() => setTab('add')} />
      )}
    </div>
  );
}
