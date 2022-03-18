import './CollectionCard.scss';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/formatters';
import { ReactComponent as TrashCanSVG } from '../../icons/trashCan.svg';
import { useDeleteCollection } from '../../hooks/graphQLAPI';
import useCurrentUser from '../../auth/useCurrentUser';

export default function CollectionCard({ collection }) {
  const { isAuthenticated } = useCurrentUser();
  const [, setErrorMessage] = useState(null);
  const [deleteCollection] = useDeleteCollection();

  const onTryDeleteCollection = async () => {
    try {
      if (isAuthenticated) {
        await deleteCollection({
          variables: {
            id: collection.id,
          },
        });
      } else {
        setErrorMessage('Cannot delete collection unless authenticated');
      }
    } catch (err) {
      setErrorMessage('Something went wrong');
    }
  };

  return (
    <div className="collection-card">
      <p className="created-at">
        Collection created {formatDate(collection.createdAt)}
      </p>
      <h3>
        <Link to={`/collection/${collection.id}`}>{collection.name}</Link>
      </h3>
      <div className="collection-stats">
        <span>
          Datasets: {collection.datasetIds ? collection.datasetIds.length : 0}
        </span>
      </div>
      <button
        onClick={onTryDeleteCollection}
        type="button"
        className="header-button"
      >
        <TrashCanSVG />
      </button>
    </div>
  );
}
