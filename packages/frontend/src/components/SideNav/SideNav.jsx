import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import './SideNav.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import { ReactComponent as ExploreSVG } from '../../icons/explore.svg';
import { ReactComponent as CollectionsSVG } from '../../icons/collection.svg';
import { ReactComponent as DataClinicSVG } from '../../icons/dataClinicWhite.svg';
import CollectionTab from '../CollectionTab/CollectionTab';
// import { useCurrentCollection } from '../../hooks/collections';
import { useCurrentUser } from '../../hooks/graphQLAPI';
import { USE_SINGLE_CITY } from '../../flags';

export default function SideNav() {
  const [showCollectionTab, setShowCollectionTab] = useState(false);
  // const [collection] = useCurrentCollection();
  const collection = { datasets: [] };
  const { data: userData } = useCurrentUser();

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
        to="/explore"
      >
        <ExploreSVG />
        <h1>Explore</h1>
      </NavLink>
      <div className="collections-button" style={{ position: 'relative' }}>
        {collection.datasets.length > 0 && (
          <div className="collection-counter">{collection.datasets.length}</div>
        )}
        <button
          onClick={() => setShowCollectionTab(!showCollectionTab)}
          type="button"
          className="header-button"
        >
          <CollectionsSVG />
          <h1>Collections</h1>
        </button>
        <CollectionTab
          visible={showCollectionTab}
          onDismiss={() => setShowCollectionTab(false)}
        />
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

      {!USE_SINGLE_CITY && (
        <NavLink
          exact
          alt="login/sign-up"
          className={({ isActive }) =>
            classNames('login', {
              'active-nav': isActive,
            })
          }
          to="/login"
        >
          <FontAwesomeIcon size="2x" icon={faUser} />
          <h1>{userData ? userData.profile.username : 'account'}</h1>
        </NavLink>
      )}
    </nav>
  );
}
