/* @jsxImportSource @emotion/react */
import '@reach/menu-button/styles.css';
import pluralize from 'pluralize';
import { toast } from 'react-toastify';
import { useCallback, useState, useMemo, ReactElement } from 'react';
import { css } from '@emotion/react/macro';
import { useQuery, gql } from '@apollo/client';
import styled from '@emotion/styled/macro';
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

const GET_COLLECTIONS_QUERY = gql`
  query GetUserCollections {
    profile {
      collections {
        id
        name
        datasets {
          id
        }
      }
    }
  }
`;

const StyledMenuList = styled(MenuList)`
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  font-size: 12px;
  margin-top: 4px;
`;

const MenuItemHeader = styled.h6`
  font-size: 13px;
  font-weight: 700;
  padding-left: 10px;
`;

type Collection = {
  id: string;
  name: string;
  datasets: ReadonlyArray<{
    id: string;
  }>;
};

function useCollections(): [readonly Collection[], boolean] {
  const { data, loading } = useQuery(GET_COLLECTIONS_QUERY);
  return [data?.profile.collections || [], loading];
}

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
  const [collections, loadingCollections] = useCollections();
  const onDismissModal = useCallback(() => setIsCreateModalOpen(false), []);

  // calculate how many collections have this dataset
  const collectionsWithDataset = useMemo(
    () =>
      new Set(
        collections
          .filter(col => col.datasets.some(d => d.id === datasetId))
          .map(col => col.id),
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
      .filter(col => collectionsWithDataset.has(col.id))
      .map(collectionToMenuItem);
    const withoutDataset = collections
      .filter(col => !collectionsWithDataset.has(col.id))
      .map(collectionToMenuItem);

    return [withDataset, withoutDataset];
  }, [collections, collectionsWithDataset, datasetId]);

  function renderMenuContent(): JSX.Element | ReactElement[] {
    if (loadingCollections) {
      return (
        <BasicMenuItem
          onSelect={noop}
          css={{
            cursor: 'default',
            display: 'flex',
            justifyContent: 'center',
            width: 130,
          }}
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
          <MenuItemHeader>Collections that have this dataset</MenuItemHeader>
          {itemsWithDataset}
          <MenuItemHeader
            css={css`
              margin-top: 8px;
            `}
          >
            Other collections
          </MenuItemHeader>
          {itemsWithoutDataset}
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
      <MenuButton>
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
          <div
            css={css`
              display: flex;
              flex: 1;
              justify-content: center;
            `}
          >
            <button
              type="button"
              style={{ marginRight: 8 }}
              disabled={isCreating}
              onClick={async () => {
                await onTryCreateCollection(name, description);
                onDismissModal();
                toast('Collection created!');
              }}
            >
              Create
            </button>
            <button type="button" onClick={onDismissModal}>
              Cancel
            </button>
          </div>
        </Modal>
      ) : null}
    </Menu>
    /* eslint-enable */
  );
}
