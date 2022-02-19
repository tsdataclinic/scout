import React, { useState } from 'react';
import { useUserCollections } from '../../hooks/collections';
import { CollectionTabCreate } from './CollectionTabCreate';
import { CollectionTabSwitch } from './CollectionTabSwitch';
import { CollectionTabAdd } from './CollectionTabAdd';
import './CollectionTab.scss';

export default function CollectionTab({ visible, onDismiss }) {
  const [
    { collections, activeCollection, activeCollectionID },
    { setActiveCollection },
  ] = useUserCollections();
  /*
  const [
    { activeCollection: collection },
    { removeFromCurrentCollection, createCollectionFromPending },
  ] = useUserCollections();

  const currentCollectionDatasets =
    activeCollection && activeCollection.datasets
      ? activeCollection.datasets
      : [];
  */

  const [tab, setTab] = useState('add');

  const onCreate = () => {
    setTab('create');
  };

  const onCollectionCreated = (collectionID) => {
    setActiveCollection(collectionID);
    setTab('add');
  };

  console.log('Rendering CollectionTab', {
    activeCollectionID,
    collections,
    activeCollection,
  });

  if (!visible) return '';

  return (
    <div className="collection-tab">
      {tab === 'create' && (
        <CollectionTabCreate
          isPending
          datasetIds={activeCollection.datasets.map((d) => d.id)}
          onDone={onCollectionCreated}
        />
      )}

      {tab === 'add' && activeCollectionID && (
        <CollectionTabAdd
          onSwitch={() => setTab('switch')}
          collectionId={activeCollectionID}
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
