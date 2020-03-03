import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import './SideNav.scss';
import { ReactComponent as ExploreSVG } from '../../icons/explore.svg';
import { ReactComponent as CollectionsSVG } from '../../icons/collection.svg';
import { ReactComponent as DataClinicSVG } from '../../icons/dataClinicWhite.svg';

import CollectionTab from '../CollectionTab/CollectionTab';
import { useCurrentCollection } from '../../hooks/collections';

export default function SideNav() {
  const [showCollectionTab, setShowCollectionTab] = useState(false);
  const [collection] = useCurrentCollection();

  return (
    <nav className="side-nav">
      <Link alt="Data Clinic" className="title" to="/">
        <h2 className="scout-h2">scout</h2>

        <p className="scout-sub">by data clinic</p>
      </Link>
      <NavLink
        activeClassName="active-nav"
        alt="Explore"
        className="explore"
        exact
        to="/"
      >
        <ExploreSVG />
        <h1>Explore</h1>
      </NavLink>
      <div style={{ position: 'relative' }}>
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
        activeClassName="active-nav"
        alt="about"
        className="about"
        to="/about"
      >
        <DataClinicSVG />
        <h1>About</h1>
      </NavLink>
    </nav>
  );
}
