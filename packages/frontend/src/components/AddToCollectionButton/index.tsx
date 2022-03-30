/** @jsxImportSource @emotion/react */
import { useQuery, gql } from '@apollo/client';
import { useMemo } from 'react';
import styled from '@emotion/styled/macro';
import { Menu, MenuButton, MenuList, MenuItem } from '@reach/menu-button';
import noop from '../../utils/noop';
import LoadingSpinner from '../Loading/LoadingSpinner';
import '@reach/menu-button/styles.css';

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
  const [collections, loading] = useCollections();
  const items = useMemo(
    () =>
      collections.map(coll => (
        <StyledMenuItem key={coll.id} onSelect={() => undefined}>
          {coll.name}
        </StyledMenuItem>
      )),
    [collections],
  );

  // calculate how many collections have this dataset
  const collectionsWithDataset = useMemo(
    () =>
      collections.filter(coll => coll.datasets.some(d => d.id === datasetId)),
    [collections, datasetId],
  );
  const numCollectionsWithDataset = collectionsWithDataset.length;

  return (
    <Menu>
      <MenuButton>Add to collection ({numCollectionsWithDataset})</MenuButton>
      <StyledMenuList>
        {loading ? (
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
        ) : (
          items
        )}
      </StyledMenuList>
    </Menu>
  );
}
