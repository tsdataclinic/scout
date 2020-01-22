import React from 'react';
import './App.scss';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { ModalContainer, ModalRoute } from 'react-router-modal';
import HomePage from './layout/HomePage/HomePage';
import DatasetPage from './layout/DatasetPage/DatasetPage';
import CollectionPage from './layout/CollectionPage/CollectionPage';
import CreateCollectionModal from './components/CreateCollectionModal/CreateCollectionModal';

import 'react-router-modal/css/react-router-modal.css';

function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <div className="App">
        <Route path="/" exact component={HomePage} />
        <Route path="/dataset/:datasetID" exact component={DatasetPage} />
        <Route
          path="/collection/:name/:datasetIDs"
          exact
          component={CollectionPage}
        />
        <ModalRoute
          path="/collection/new"
          parentPath="/"
          component={CreateCollectionModal}
        />
      </div>

      <ModalContainer />
    </Router>
  );
}

export default App;
