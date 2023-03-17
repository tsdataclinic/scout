import { useState } from 'react';
import { toast } from 'react-toastify';
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
          className="primary-button"
          type="submit"
          onClick={async () => {
            await onTryCreateCollection(name, description);
            onDone();
            toast('Created collection');
          }}
        >
          Create
        </button>
        <button
          className="primary-button"
          type="button"
          onClick={() => onDone()}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
