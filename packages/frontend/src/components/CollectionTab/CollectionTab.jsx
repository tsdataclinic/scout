import { useState } from 'react';
import { useUserCollections } from '../../hooks/collections';
import { CollectionTabCreate } from './CollectionTabCreate';
import { CollectionTabSwitch } from './CollectionTabSwitch';
import { CollectionTabAdd } from './CollectionTabAdd';
import './CollectionTab.scss';
import CollectionTabList from './CollectionTabList';

export default function CollectionTab({ visible, onDismiss }) {
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
    <div className="collection-tab">
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
