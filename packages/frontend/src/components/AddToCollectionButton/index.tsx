import styled from 'styled-components/macro';
import '@reach/menu-button/styles.css';
import pluralize from 'pluralize';
import { toast } from 'react-toastify';
import { useCallback, useState, useMemo, ReactElement } from 'react';
import { Menu, MenuButton, MenuList } from '@reach/menu-button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import noop from '../../utils/noop';
import LoadingSpinner from '../Loading/LoadingSpinner';
import Modal from '../Modal';
import CollectionCreateForm from '../CollectionTab/CollectionCreateForm';
import useCollectionCreate from '../CollectionTab/useCollectionCreate';
import BasicMenuItem from './BasicMenuItem';
import CollectionMenuItem from './CollectionMenuItem';
import { usePreventCollectionTabBlur } from '../CollectionTab/CollectionTab';
import { useUserCollections } from '../../hooks/collections';

const MenuItemHeader = styled.h6`
  font-size: 0.9rem;
  font-weight: 700;
  line-height: 1.25rem;
  padding-left: 10px;
  padding-right: 24px;
`;

const StyledMenuList = styled(MenuList)`
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  font-size: 0.875rem;
  line-height: 1.25rem;
  margin-top: 4px;
`;

type Collection = {
  id: string;
  name: string;
  datasetIds: readonly string[];
};

type Props = {
  /** An AddToCollection button should always be associated to a dataset id */
  datasetId: string;
};

export default function AddToCollectionButton({
  datasetId,
}: Props): JSX.Element {
  const preventCollectionTabBlur = usePreventCollectionTabBlur();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [onTryCreateCollection, isCreating] = useCollectionCreate();
  const onDismissModal = useCallback(() => setIsCreateModalOpen(false), []);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore TODO: remove this ts-ignore
  const [{ collections, loadingCollections }, { addToCollection }] =
    useUserCollections();

  // calculate how many collections have this dataset
  const collectionsWithDataset = useMemo(
    () =>
      new Set(
        collections
          .filter((col: Collection) => col.datasetIds.includes(datasetId))
          .map((col: Collection) => col.id),
      ),
    [collections, datasetId],
  );

  const numCollectionsWithDataset = collectionsWithDataset.size;

  const [itemsWithDataset, itemsWithoutDataset] = useMemo(() => {
    function collectionToMenuItem(collection: Collection): JSX.Element {
      return (
        <CollectionMenuItem
          key={collection.id}
          collectionId={collection.id}
          datasetId={datasetId}
          name={collection.name}
          collectionContainsDataset={collectionsWithDataset.has(collection.id)}
        />
      );
    }

    const withDataset = collections
      .filter((col: Collection) => collectionsWithDataset.has(col.id))
      .map(collectionToMenuItem);
    const withoutDataset = collections
      .filter((col: Collection) => !collectionsWithDataset.has(col.id))
      .map(collectionToMenuItem);

    return [withDataset, withoutDataset];
  }, [collections, collectionsWithDataset, datasetId]);

  function renderMenuContent(): JSX.Element | ReactElement[] {
    if (loadingCollections) {
      return (
        <BasicMenuItem
          onSelect={noop}
          css={`
            cursor: default;
            display: flex;
            justify-content: center;
            width: 130px;
          `}
        >
          <LoadingSpinner />
        </BasicMenuItem>
      );
    }

    if (collections.length === 0) {
      return (
        <BasicMenuItem
          onSelect={() => {
            setIsCreateModalOpen(true);
          }}
        >
          Create your first collection
        </BasicMenuItem>
      );
    }

    if (itemsWithDataset.length > 0) {
      return (
        <>
          <MenuItemHeader className="mb-1">
            Collections that have this dataset
          </MenuItemHeader>
          {itemsWithDataset}
          <MenuItemHeader className="mb-1 mt-2">
            Other collections
          </MenuItemHeader>
          {itemsWithoutDataset.length === 0 ? (
            <p css="margin-left: 10px;">There are no other collections</p>
          ) : (
            itemsWithoutDataset
          )}
        </>
      );
    }

    return itemsWithoutDataset;
  }

  const menuButtonText =
    numCollectionsWithDataset === 0
      ? 'Add to collection'
      : `In ${pluralize('collection', numCollectionsWithDataset, true)}`;

  return (
    /* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */
    <Menu>
      <MenuButton className="primary-button text-sm w-40">
        <div onClick={preventCollectionTabBlur}>
          {menuButtonText}
          <FontAwesomeIcon
            style={{ marginLeft: 8 }}
            size="1x"
            icon={faCaretDown}
          />
        </div>
      </MenuButton>
      <StyledMenuList>
        <div onClick={preventCollectionTabBlur}>{renderMenuContent()}</div>
      </StyledMenuList>
      {isCreateModalOpen ? (
        <Modal isOpen onDismiss={onDismissModal}>
          <CollectionCreateForm
            name={name}
            description={description}
            onNameChange={setName}
            onDescriptionChange={setDescription}
          />
          <div className="flex flex-1 justify-center mt-2">
            <button
              className="primary-button"
              type="button"
              style={{ marginRight: 8 }}
              disabled={isCreating}
              onClick={async () => {
                const collectionId = await onTryCreateCollection(
                  name,
                  description,
                );
                await addToCollection(datasetId, collectionId);
                onDismissModal();
                toast('Created collection!');
              }}
            >
              Create and add dataset
            </button>
            <button
              className="primary-button !text-slate-700 !bg-gray-200"
              type="button"
              onClick={onDismissModal}
            >
              Cancel
            </button>
          </div>
        </Modal>
      ) : null}
    </Menu>
    /* eslint-enable */
  );
}
