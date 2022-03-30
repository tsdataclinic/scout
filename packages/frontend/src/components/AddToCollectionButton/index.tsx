/** @jsxImportSource @emotion/react */
import '@reach/menu-button/styles.css';
import { toast } from 'react-toastify';
import { useCallback, useState, useMemo, ReactElement } from 'react';
import { css } from '@emotion/react/macro';
import { useQuery, gql } from '@apollo/client';
import styled from '@emotion/styled/macro';
import { Menu, MenuButton, MenuList, MenuItem } from '@reach/menu-button';
import noop from '../../utils/noop';
import LoadingSpinner from '../Loading/LoadingSpinner';
import Modal from '../Modal';
import CollectionCreateForm from '../CollectionTab/CollectionCreateForm';
import useCollectionCreate from '../CollectionTab/useCollectionCreate';

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

const StyledMenuItem = styled(MenuItem)`
  max-width: 340px;
  overflow: hidden;
  text-overflow: ellipsis;
  &:hover {
    background-color: #f7fafc;
    color: black;
  }
`;

function useCollections(): [
  ReadonlyArray<{
    id: string;
    name: string;
    datasets: ReadonlyArray<{
      id: string;
    }>;
  }>,
  boolean,
] {
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
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [onTryCreateCollection, isCreating] = useCollectionCreate();
  const [collections, loadingCollections] = useCollections();
  const onDismissModal = useCallback(() => setIsCreateModalOpen(false), []);

  // calculate how many collections have this dataset
  const collectionsWithDataset = useMemo(
    () =>
      collections.filter(coll => coll.datasets.some(d => d.id === datasetId)),
    [collections, datasetId],
  );
  const numCollectionsWithDataset = collectionsWithDataset.length;

  const items = useMemo(
    () =>
      collections.map(coll => (
        <StyledMenuItem key={coll.id} onSelect={() => undefined}>
          {coll.name}
        </StyledMenuItem>
      )),
    [collections],
  );

  function renderMenuContent(): JSX.Element | ReactElement[] {
    if (loadingCollections) {
      return (
        <StyledMenuItem
          onSelect={noop}
          css={{
            cursor: 'default',
            display: 'flex',
            justifyContent: 'center',
            width: 130,
          }}
        >
          <LoadingSpinner />
        </StyledMenuItem>
      );
    }

    if (numCollectionsWithDataset === 0) {
      return (
        <StyledMenuItem
          onSelect={() => {
            setIsCreateModalOpen(true);
          }}
        >
          Create your first collection
        </StyledMenuItem>
      );
    }

    return items;
  }

  return (
    <Menu>
      <MenuButton>Add to collection ({numCollectionsWithDataset})</MenuButton>
      <StyledMenuList>{renderMenuContent()}</StyledMenuList>
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
  );
}
