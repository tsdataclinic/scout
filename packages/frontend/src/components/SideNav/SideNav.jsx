/* eslint-disable */
import { useCallback, useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import './SideNav.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import { ReactComponent as ExploreSVG } from '../../icons/explore.svg';
import { ReactComponent as CollectionsSVG } from '../../icons/collection.svg';
import { ReactComponent as DataClinicSVG } from '../../icons/dataClinicWhite.svg';
import CollectionTab from '../CollectionTab/CollectionTab';
import { GLOBAL_PORTAL_IDENTIFIER } from '../../portals';
import { useUserCollections } from '../../hooks/collections';
import useLoginLogout from '../../auth/useLoginLogout';
import useCurrentUser from '../../auth/useCurrentUser';

export default function SideNav() {
  const [showCollectionTab, setShowCollectionTab] = useState(false);
  const [{ activePortalAbbreviation, globalPortalsAreActive }] =
    useUserCollections();
  const { isAuthenticated } = useCurrentUser();
  const { login, logout } = useLoginLogout();
  const onCollectionTabDismiss = useCallback(
    () => setShowCollectionTab(false),
    [],
  );

  return (
    <nav className="side-nav">
      <Link alt="Data Clinic" className="title" to="/">
        <h2 className="scout-h2">scout</h2>
        <p className="scout-sub">by data clinic</p>
      </Link>
      <NavLink
        className={({ isActive }) =>
          classNames('explore', {
            'active-nav': isActive,
          })
        }
        alt="Explore"
        exact
        to={`/explore/${
          globalPortalsAreActive
            ? GLOBAL_PORTAL_IDENTIFIER
            : activePortalAbbreviation
        }`}
      >
        <ExploreSVG />
        <h1>Explore</h1>
      </NavLink>
      <div className="collections-button" style={{ position: 'relative' }}>
        <button
          onClick={() => setShowCollectionTab(!showCollectionTab)}
          type="button"
          className="header-button"
        >
          <CollectionsSVG />
          <h1>Collections</h1>
        </button>
        {showCollectionTab ? (
          <CollectionTab
            visible={showCollectionTab}
            onDismiss={onCollectionTabDismiss}
          />
        ) : null}
      </div>
      <NavLink
        exact
        className={({ isActive }) =>
          classNames('about', {
            'active-nav': isActive,
          })
        }
        alt="about"
        to="/about"
      >
        <DataClinicSVG />
        <h1>About</h1>
      </NavLink>

      <div
        role="button"
        className="login"
        onClick={async () => {
          try {
            if (isAuthenticated) {
              await logout();
            } else {
              await login();
            }

            // refresh the page after logging in or out just to make sure all
            // application state gets reset correctly
            window.location.reload();
          } catch (err) {
            console.error(err);
          }
        }}
      >
        <FontAwesomeIcon size="2x" icon={faUser} />
        {/* <h1>{user ? user.username : 'account'}</h1> */}
        <h1>{isAuthenticated ? 'Sign out' : 'Sign in'}</h1>
      </div>
    </nav>
  );
}
