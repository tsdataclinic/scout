import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import CollectionCard from '../../components/CollectionCard/CollectionCard';
import { useUserCollections } from '../../hooks/collections';
import './CollectionsPage.scss';
import usePageView from '../../hooks/analytics';

export default function CollectionsPage() {
  usePageView();
  const [{ collections }] = useUserCollections();
  const nonPendingCollections = collections.filter((c) => c.id !== 'pending');

  console.log('user page collections ', collections);
  return (
    <div className="collections-page">
      <div className="collections-header">
        <h2>My Collections</h2>
        <p>{nonPendingCollections.length} Collections</p>
      </div>

      {nonPendingCollections.length == 0 && (
        <div className="no-collections">
          <div className="collection-icon">
            <FontAwesomeIcon icon={faLayerGroup} />
          </div>
          <h3>No Collections found</h3>
          <p>
            Select 'Add to Collection' on datasets to begin creating local
            connections
          </p>
          <div className="what-are-collections">
            <h3>What are Collections?</h3>
            <p>
              Collections allow you to group, save and share similar datasets.
              Collections are saved locally - to share your Collection use the
              share url. If a dataset updates on the open data portal, it will
              also update within your collection
            </p>
          </div>
        </div>
      )}
      {nonPendingCollections.length > 0 && (
        <div className="collections-list">
          <ul>
            {nonPendingCollections.map((collection) => (
              <li>
                <Link to={`/collection/${collection.id}`}>
                  <CollectionCard collection={collection} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
