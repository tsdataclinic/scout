import React from 'react';
import './App.scss';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';
import { ModalContainer, ModalRoute } from 'react-router-modal';
import { Privacy, TermsOfService } from '@dataclinic/dataclinic';

import SideNav from './components/SideNav/SideNav';
import HomePage from './layout/HomePage/HomePage';
import DatasetPage from './layout/DatasetPage/DatasetPage';
import CollectionPage from './layout/CollectionPage/CollectionPage';
import AboutPage from './layout/AboutPage/AboutPage';
import CollectionsPage from './layout/CollectionsPage/CollectionsPage';
import CreateCollectionModal from './components/CreateCollectionModal/CreateCollectionModal';
import WelcomeModal from './components/WelcomeModal/WelcomeModal';

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
            <Route path="/collections" component={CollectionsPage} />
            <Route path="/privacy" component={Privacy} />
            <Route path="/terms" component={TermsOfService} />

            <ModalRoute
              path="/collection/new"
              parentPath="/"
              component={CreateCollectionModal}
            />
            <Route path="/" component={HomePage} />
            <Route path="/privacy" exact component={Privacy} />
            <Redirect from="/" to="/" />
          </Switch>
        </div>
        <WelcomeModal />
      </Router>
    </div>
  );
}

export default App;
