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
import CollectionsPage from './layout/CollectionsPage/CollectionsPage';
import CreateCollectionModal from './components/CreateCollectionModal/CreateCollectionModal';
import WelcomeModal from './components/WelcomeModal/WelcomeModal';
import GHPagesRedirect from './components/GHPagesRedirect/GHPagesRedirect';
import { Portals, DEFAULT_PORTAL } from './portals';
import { OpenDataProvider } from './contexts/OpenDataContext';

import 'react-router-modal/css/react-router-modal.css';

function App() {
  const baseName = process.env.PUBLIC_URL
    ? `/${process.env.PUBLIC_URL.split('/').slice(-1)[0]}`
    : '';
  console.log('base name is ', baseName);
  return (
    <div className="App">
      <Router basename={baseName}>
        <ModalContainer />
        <Route exact path="/">
          {!sessionStorage.redirect && <Redirect from="/" to="/NYC" />}
        </Route>
        <Route
          path="/:portal"
          render={({ match }) => {
            const { portal } = match.params;
            if (
              !Object.keys(Portals).includes(portal) &&
              match.path.includes('collection')
            ) {
              return <Redirect to={`/${DEFAULT_PORTAL}`} />;
            }
            return (
              <OpenDataProvider portal={Portals[portal]}>
                <div className="content">
                  <Switch>
                    <Route
                      path={`${match.path}/dataset/:datasetID`}
                      component={DatasetPage}
                    />
                    <Route
                      path="/collection/:name/:datasetIDs"
                      component={CollectionPage}
                    />

                    <Route path="/about" component={AboutPage} />
                    <Route path="/collections" component={CollectionsPage} />

                    <ModalRoute
                      path="collection/new"
                      parentPath="/"
                      component={CreateCollectionModal}
                    />
                    <Route path="" component={HomePage} />
                    <Redirect from="/" to="/CHI" />
                  </Switch>
                </div>
                <SideNav />
              </OpenDataProvider>
            );
          }}
        />
        <GHPagesRedirect />
        <WelcomeModal />
      </Router>
    </div>
  );
}

export default App;
