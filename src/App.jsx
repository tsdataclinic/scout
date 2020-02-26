import React from 'react';
import './App.scss';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';
import { ModalContainer, ModalRoute } from 'react-router-modal';

import SideNav from './components/SideNav/SideNav';
import HomePage from './layout/HomePage/HomePage';
import DatasetPage from './layout/DatasetPage/DatasetPage';
import CollectionPage from './layout/CollectionPage/CollectionPage';
import AboutPage from './layout/AboutPage/AboutPage';
import CreateCollectionModal from './components/CreateCollectionModal/CreateCollectionModal';
import WelcomeModal, {
  WelcomeRedirect,
} from './components/WelcomeModal/WelcomeModal';
import GHPagesRedirect from './components/GHPagesRedirect/GHPagesRedirect';

import 'react-router-modal/css/react-router-modal.css';

function App() {
  return (
    <div className="App">
      <Router basename={process.env.PUBLIC_URL}>
        <ModalContainer />
        <SideNav />
        <div className="content">
          <Switch>
            <Route path="/dataset/:datasetID" component={DatasetPage} />
            <Route
              path="/collection/:name/:datasetIDs"
              component={CollectionPage}
            />

            <Route path="/about" component={AboutPage} />
            <ModalRoute
              path="/collection/new"
              parentPath="/"
              component={CreateCollectionModal}
            />
            <Route path="/" component={HomePage} />
            <Redirect from="/" to="/" />
          </Switch>
        </div>
        <GHPagesRedirect />
        <WelcomeRedirect />
        <ModalRoute path="/welcome" parentPath="/" component={WelcomeModal} />
      </Router>
    </div>
  );
}

export default App;
