import { useCallback, ChangeEvent } from 'react';

type Props = {
  description: string;
  name: string;
  onDescriptionChange: (val: string) => void;
  onNameChange: (val: string) => void;
};

export default function CollectionCreateForm({
  description,
  name,
  onDescriptionChange,
  onNameChange,
}: Props): JSX.Element {
  const onNameChangeFn = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => onNameChange(e.target.value),
    [onNameChange],
  );

  const onDescriptionChangeFn = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => onDescriptionChange(e.target.value),
    [onDescriptionChange],
  );

  return (
    <>
      <h2>Create Collection</h2>
      <div className="collections-tab-create-options space-y-2">
        <p>Name your new collection</p>
        <input
          placeholder="Name"
          className="border !border-gray-400"
          type="text"
          value={name}
          onChange={onNameChangeFn}
        />
        <p>Describe your collection</p>
        <input
          className="border !border-gray-400"
          placeholder="Description"
          type="text"
          value={description}
          onChange={onDescriptionChangeFn}
        />
      </div>
    </>
  );
}
