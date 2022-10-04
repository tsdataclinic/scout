import 'styled-components/macro';
import './CollectionCard.scss';
import { useState } from 'react';
import pluralize from 'pluralize';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { useDeleteCollection } from '../../hooks/graphQLAPI';
import useCurrentUser from '../../auth/useCurrentUser';
import Modal from '../Modal';
import { useCollectionsValue } from '../../contexts/CollectionsContext';

export default function CollectionCard({ collection }) {
  const { isAuthenticated } = useCurrentUser();
  const [, setErrorMessage] = useState(null);
  const [deleteCollection] = useDeleteCollection();
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [, dispatch] = useCollectionsValue();

  const onDismissModal = () => setShowDeleteConfirmModal(false);

  const onRequestDelete = event => {
    // Prevent the Card's link from triggering when Delete is clicked
    event.preventDefault();
    event.stopPropagation();
    setShowDeleteConfirmModal(true);
  };

  const onTryDeleteCollection = async () => {
    try {
      if (isAuthenticated) {
        setIsDeleting(true);
        await deleteCollection({
          variables: {
            id: collection.id,
          },
        });
        setIsDeleting(false);
        onDismissModal();
        toast('Collection deleted');
      } else {
        dispatch({
          type: 'DELETE_COLLECTION',
          payload: {
            collectionId: collection.id,
          },
        });
      }
    } catch (err) {
      setErrorMessage('Something went wrong');
    }
  };

  return (
    <>
      <Link to={`/collection/${collection.id}`} className="collection-card">
        <div className="custom-column left">
          <h3>{collection.name}</h3>
          <div className="collection-stats">
            <span>
              {pluralize('dataset', collection.datasetIds?.length ?? 0, true)}
            </span>
          </div>
        </div>
        <div className="custom-column right">
          <button
            css={`
              background: none;
              position: absolute;
              right: 4px;
              top: -6px;
              width: auto;
            `}
            onClick={onRequestDelete}
            type="button"
          >
            <FontAwesomeIcon
              css={`
                color: #8eacd1;
                font-size: 15px;
                transition: all 250ms;
                &:hover {
                  color: #657790;
                }
              `}
              size="1x"
              icon={faTrash}
            />
          </button>
        </div>
      </Link>
      {showDeleteConfirmModal ? (
        <Modal isOpen onDismiss={onDismissModal}>
          <p css="font-size: 1.4rem">
            Are you sure you want to delete this collection?
          </p>
          <div
            css={`
              display: flex;
              flex: 1;
              justify-content: center;
            `}
          >
            <button
              type="button"
              style={{ marginRight: 8 }}
              disabled={isDeleting}
              onClick={onTryDeleteCollection}
            >
              Delete
            </button>
            <button type="button" onClick={onDismissModal}>
              Cancel
            </button>
          </div>
        </Modal>
      ) : null}
    </>
  );
}
