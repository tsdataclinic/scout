import { useState } from 'react';
import CollectionCreateForm from './CollectionCreateForm';
import useCollectionCreate from './useCollectionCreate';

export function CollectionTabCreate({ onDone }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [onTryCreateCollection] = useCollectionCreate();

  return (
    <div className="collections-tab-create">
      <CollectionCreateForm
        name={name}
        description={description}
        onNameChange={setName}
        onDescriptionChange={setDescription}
      />
      <div className="collection-tab-buttons">
        <button
          type="submit"
          onClick={async () => {
            const createdCollectionId = await onTryCreateCollection();
            onDone(createdCollectionId);
          }}
        >
          Create
        </button>
        <button type="button" onClick={() => onDone(undefined)}>
          Cancel
        </button>
      </div>
    </div>
  );
}
