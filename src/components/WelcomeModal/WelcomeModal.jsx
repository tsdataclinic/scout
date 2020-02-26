import React, { useEffect } from 'react';
import './WelcomeModal.scss';
import { Redirect } from 'react-router-dom';
import { Modal } from 'react-router-modal';
import useSeenWelcome from '../../hooks/useSeenWelcome';

export default function WelcomeModal({ closeModal }) {
  const [seenWelcome, setSeenWelcome] = useSeenWelcome();
  const recordDismiss = () => {
    setSeenWelcome();
  };

  useEffect(() => {
    if (seenWelcome) {
      closeModal();
    }
  }, [closeModal, seenWelcome]);

  return !seenWelcome ? (
    <Modal onBackdropClick={recordDismiss}>
      <div className="welcome-modal">
        <h2>Welcome to Scout!</h2>
        <p>
          Thanks for trying Scout. Scout is a new way to browse open data
          portals. It is built with discoverability in mind. To learn more,
          click the about button. To get started, try searching for a dataset or
          select a dataset to see recomendations.
        </p>

        <p>
          You can also create collections of datasets which you can share with
          others. To do so start collecting or click on the collections tab
        </p>
      </div>
    </Modal>
  ) : (
    <Redirect to="/welcome" />
  );
}

export function WelcomeRedirect() {
  const [seenWelcome] = useSeenWelcome();
  return seenWelcome ? '' : <Redirect to="/welcome" />;
}
