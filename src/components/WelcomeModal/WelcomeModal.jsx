import React from 'react';
import './WelcomeModal.scss';
import { Modal } from 'react-router-modal';
import useSeenWelcome from '../../hooks/useSeenWelcome';

export default function WelcomeModal() {
  const [seenWelcome, loaded, setSeenWelcome] = useSeenWelcome();
  const recordDismiss = () => {
    setSeenWelcome();
  };

  return (
    !seenWelcome &&
    loaded && (
      <Modal onBackdropClick={recordDismiss}>
        <div className="welcome-modal">
          <h2>Welcome to Scout!</h2>
          <p>
            Thanks for trying Scout. Scout is a new way to browse open data
            portals. It is built with discoverability in mind. To learn more,
            click the about button. To get started, try searching for a dataset
            or select a dataset to see recomendations.
          </p>

          <p>
            You can also create collections of datasets which you can share with
            others. To do so start collecting or click on the collections tab
          </p>
        </div>
      </Modal>
    )
  );
}
