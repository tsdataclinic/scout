import React from 'react';
import 'antd/dist/antd.css';
import './App.scss';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';
import { ModalContainer } from 'react-router-modal';
import SideNav from './components/SideNav/SideNav';
import HomePage from './layout/HomePage/HomePage';
import DatasetPage from './layout/DatasetPage/DatasetPage';
import CollectionPage from './layout/CollectionPage/CollectionPage';
import AboutPage from './layout/AboutPage/AboutPage';
import CollectionsPage from './layout/CollectionsPage/CollectionsPage';
import WelcomeModal from './components/WelcomeModal/WelcomeModal';
import GHPagesRedirect from './components/GHPagesRedirect/GHPagesRedirect';
import { DEFAULT_PORTAL } from './portals';
import { USE_SINGLE_CITY } from './flags';

import 'react-router-modal/css/react-router-modal.css';
import UserAccountModal from './components/UserAccountModal/UserAccountModal';
import { ProfilePage } from './layout/ProfilePage/ProfilePage';
import { usePortals } from './hooks/graphQLAPI';

function App() {
  const baseName = process.env.PUBLIC_URL
    ? `/${process.env.PUBLIC_URL.split('/').slice(-1)[0]}`
    : '';

  const { data: portalData } = usePortals();
  const Portals = portalData ? portalData.portals : null;
  console.log('Portals retrieved:', Portals);

  return (
    <div className="App">
      <Router basename={baseName}>
        <ModalContainer />
        <Route exact path="/">
          {!sessionStorage.redirect && <Redirect from="/" to="/NYC" />}
        </Route>

        <div className="content">
          {!USE_SINGLE_CITY && (
            <Route exact path="/login" component={UserAccountModal} />
          )}
          <Route exact path="/about" component={AboutPage} />
          <Route exact path="/profile" component={ProfilePage} />

          <Route path="/collections" component={CollectionsPage} />
          <Route
            path="/collection/:name/:datasetIDs"
            component={CollectionPage}
          />
          <Route path="/collection/:id" component={CollectionPage} />
          <Route
            path="/:portal"
            render={({ match }) => {
              const { portal } = match.params;

              if (
                [
                  'login',
                  'about',
                  'profile',
                  'collection',
                  'collections',
                ].includes(portal)
              ) {
                return null;
              }
              const portalDetails = Portals
                ? Portals.find((p) => p.abbreviation === portal)
                : null;
              if (Portals && !portalDetails) {
                return <Redirect to={`/${DEFAULT_PORTAL}`} />;
              }

              // TODO: remove this when multi-city is ready to go
              if (
                portalDetails &&
                portal !== DEFAULT_PORTAL &&
                USE_SINGLE_CITY
              ) {
                return <Redirect to={`/${DEFAULT_PORTAL}`} />;
              }

              return (
                <Switch>
                  <Route
                    path={`${match.path}/dataset/:datasetID`}
                    component={DatasetPage}
                  />

                  <Route
                    path=""
                    render={() =>
                      Portals ? (
                        <HomePage
                          portal={Portals.find(
                            (p) => p.abbreviation === portal,
                          )}
                        />
                      ) : (
                        'Loading ...'
                      )
                    }
                  />
                  <Redirect from="/" to={`/${DEFAULT_PORTAL}`} />
                </Switch>
              );
            }}
          />
        </div>
        <SideNav />
        <GHPagesRedirect />
        <WelcomeModal />
      </Router>
    </div>
  );
}

export default App;
