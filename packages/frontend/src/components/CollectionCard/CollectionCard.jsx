/* @jsxImportSource @emotion/react */
import './CollectionCard.scss';
import { useState } from 'react';
import { css } from '@emotion/react/macro';
import pluralize from 'pluralize';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { formatDate } from '../../utils/formatters';
import { useDeleteCollection } from '../../hooks/graphQLAPI';
import useCurrentUser from '../../auth/useCurrentUser';
import Modal from '../Modal';

export default function CollectionCard({ collection }) {
  const { isAuthenticated } = useCurrentUser();
  const [, setErrorMessage] = useState(null);
  const [deleteCollection] = useDeleteCollection();
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const onDismissModal = () => setShowDeleteConfirmModal(false);

  const onRequestDelete = () => {
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
        setErrorMessage('Cannot delete collection unless authenticated');
      }
    } catch (err) {
      setErrorMessage('Something went wrong');
    }
  };

  return (
    <div className="collection-card" css={{ position: 'relative' }}>
      <div className="custom-column left">
        <p className="created-at">
          Collection created {formatDate(collection.createdAt)}
        </p>
        <h3>
          <Link to={`/collection/${collection.id}`}>{collection.name}</Link>
        </h3>
        <div className="collection-stats">
          <span>
            {pluralize('dataset', collection.datasetIds?.length ?? 0, true)}
          </span>
        </div>
      </div>
      <div className="custom-column right">
        <button
          css={css`
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
            css={css`
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
      {showDeleteConfirmModal ? (
        <Modal isOpen onDismiss={onDismissModal}>
          <p css={{ fontSize: '1.4rem' }}>
            Are you sure you want to delete this collection?
          </p>
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
    </div>
  );
}
