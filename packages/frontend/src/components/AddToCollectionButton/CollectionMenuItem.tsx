import styled from 'styled-components/macro';
import { MenuItem } from '@reach/menu-button';
import BasicMenuItem, {
  menuItemMaxWidth,
  menuItemHoverCSS,
} from './BasicMenuItem';
import noop from '../../utils/noop';
import { useUserCollections } from '../../hooks/collections';

const MenuItemWithRemoveButton = styled(MenuItem)`
  align-items: center;
  display: flex;
  padding: 0;
  justify-content: space-between;
  ${menuItemMaxWidth}

  &:hover {
    ${menuItemHoverCSS}
  }
`;

const CollectionNameDiv = styled.div`
  background: transparent;
  cursor: default;
  overflow: hidden;
  padding: 5px 0 5px 20px;
  text-overflow: ellipsis;
  width: 100%;
`;

const RemoveButton = styled.button`
  background: transparent;
  color: #d9003a;
  flex: 0 0 90px;
  font-weight: 700;
  height: 100%;
  padding: 5px 20px;
  text-align: center;
  transition: all 250ms;

  &:hover {
    background-color: #e7e9ea;
    color: red;
  }
`;

type Props = {
  collectionId: string;
  datasetId: string;
  name: string;
  collectionContainsDataset: boolean;
};

export default function CollectionMenuItem({
  collectionId,
  datasetId,
  name,
  collectionContainsDataset,
}: Props): JSX.Element {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const [, { addToCollection, removeFromCollection }] = useUserCollections();

  const onRemoveClick = (): void => {
    removeFromCollection(datasetId, collectionId);
  };

  if (collectionContainsDataset) {
    return (
      <MenuItemWithRemoveButton key={collectionId} onSelect={noop}>
        <CollectionNameDiv>{name}</CollectionNameDiv>
        <RemoveButton onClick={onRemoveClick}>Remove</RemoveButton>
      </MenuItemWithRemoveButton>
    );
  }

  return (
    <BasicMenuItem
      key={collectionId}
      onSelect={() => {
        addToCollection(datasetId, collectionId);
      }}
    >
      {name}
    </BasicMenuItem>
  );
}
