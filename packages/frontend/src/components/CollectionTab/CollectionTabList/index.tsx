import 'styled-components/macro';
import './CollectionTabList.scss';
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import pluralize from 'pluralize';
import { Collection } from './types';
import DatasetList from './DatasetList';
import getCollectionURL from '../../../utils/getCollectionURL';
import UnderlinedLink from './UnderlinedLink';
import EmptyPanelContent from './EmptyPanelContent';

type Props = {
  collections: readonly Collection[];
  onCreate: () => void;
  onDismiss: () => void;
};

export default function CollectionTabList({
  collections,
  onCreate,
  onDismiss,
}: Props): JSX.Element {
  const [collectionIdToView, setCollectionIdToView] = useState<
    string | undefined
  >();

  const collectionToView = useMemo(
    () => collections.find(col => col.id === collectionIdToView),
    [collections, collectionIdToView],
  );

  const title = collectionToView ? (
    <UnderlinedLink to={getCollectionURL(collectionToView)}>
      {collectionToView.name}
    </UnderlinedLink>
  ) : (
    'My Collections'
  );

  const backIcon = collectionToView ? (
    <span
      role="button"
      tabIndex={0}
      onKeyPress={e => {
        if (e.key === 'Enter') {
          setCollectionIdToView(undefined);
        }
      }}
      onClick={() => {
        setCollectionIdToView(undefined);
      }}
    >
      <FontAwesomeIcon
        className="collection-tab-list__back-arrow"
        size="1x"
        icon={faArrowLeft}
      />
    </span>
  ) : null;

  function renderCollectionList(): JSX.Element {
    if (collections.length === 0) {
      return (
        <EmptyPanelContent>
          <p className="w-full">
            No collections exist yet. Click{' '}
            <button
              type="button"
              onClick={onCreate}
              css={`
                background: none;
                color: #009aa6;
                margin: 0;
                padding: 0;
                width: auto;
                &:hover {
                  color: #006f77;
                }
              `}
            >
              Create Collection
            </button>{' '}
            to start!
          </p>
        </EmptyPanelContent>
      );
    }

    return (
      <ul>
        {collections.map(collection => (
          <li key={collection.id} className="collection-tab-dataset">
            <div
              css={`
                display: flex;
                justify-content: space-between;
                .collection-tab-list__chevron-right {
                  color: #a6b9d2 !important;
                }
                &:hover .collection-tab-list__chevron-right {
                  color: #5a7598 !important;
                }
              `}
              role="button"
              tabIndex={0}
              onKeyPress={e => {
                if (e.key === 'Enter') {
                  setCollectionIdToView(collection.id);
                }
              }}
              onClick={() => {
                setCollectionIdToView(collection.id);
              }}
            >
              <div
                css={`
                  overflow: hidden;
                  padding-right: 8px !important;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                `}
              >
                <p>
                  <UnderlinedLink
                    to={getCollectionURL(collection)}
                    onClick={e => {
                      e.stopPropagation();
                    }}
                  >
                    {collection.name}
                  </UnderlinedLink>
                </p>
                <p className="agency">
                  {pluralize('dataset', collection.datasetIds.length, true)}
                </p>
              </div>
              <FontAwesomeIcon
                className="collection-tab-list__chevron-right"
                size="1x"
                icon={faChevronRight}
              />
            </div>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <>
      <div className="add-to-collection">
        <div
          className="add-to-header"
          style={{ display: 'flex', alignItems: 'center' }}
        >
          {backIcon}
          <h3>{title}</h3>
        </div>
        <div className="collection-tab-current-collection">
          {collectionToView ? (
            <DatasetList collection={collectionToView} />
          ) : (
            renderCollectionList()
          )}
        </div>
      </div>
      <div className="collection-tab-buttons">
        <button className="primary-button" type="submit" onClick={onCreate}>
          Create Collection
        </button>

        <Link to="/collections">
          <button className="primary-button" onClick={onDismiss} type="submit">
            My Collections
          </button>
        </Link>
      </div>
    </>
  );
}
