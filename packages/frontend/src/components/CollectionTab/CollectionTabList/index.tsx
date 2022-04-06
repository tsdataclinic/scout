import './CollectionTabList.scss';
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Collection } from './types';
import DatasetList from './DatasetList';
import getCollectionURL from '../../../utils/getCollectionURL';
import UnderlinedLink from './UnderlinedLink';

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
        style={{ color: 'black', marginTop: -2, marginRight: 8 }}
        size="1x"
        icon={faArrowLeft}
      />
    </span>
  ) : null;

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
            <ul>
              {collections.map(collection => (
                <li key={collection.id} className="collection-tab-dataset">
                  <div
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
                    <p className="agency">{collection.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="collection-tab-buttons">
        <button type="submit" onClick={onCreate}>
          Create Collection
        </button>

        <Link to="/collections">
          <button onClick={onDismiss} type="submit">
            My Collections
          </button>
        </Link>
      </div>
    </>
  );
}
