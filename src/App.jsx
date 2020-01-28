import React from 'react';
import './App.scss';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';
import { ModalContainer, ModalRoute } from 'react-router-modal';
import HomePage from './layout/HomePage/HomePage';
import DatasetPage from './layout/DatasetPage/DatasetPage';
import CollectionPage from './layout/CollectionPage/CollectionPage';
import CreateCollectionModal from './components/CreateCollectionModal/CreateCollectionModal';

import 'react-router-modal/css/react-router-modal.css';

function App() {
  return (
    <div className="App">
      <header>
        <h1>Data Clinic</h1>
      </header>
      <ModalContainer />
      <div className="content">
        <Router basename={process.env.PUBLIC_URL}>
          <Switch>
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
            <Redirect from="/" to="/" />
          </Switch>
        </Router>
      </div>
    </div>
  );
}

export default App;
