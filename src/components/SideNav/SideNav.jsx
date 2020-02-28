import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import './SideNav.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faQuestionCircle,
  faEye,
  faColumns,
} from '@fortawesome/free-solid-svg-icons';
import CollectionTab from '../CollectionTab/CollectionTab';
import { useCurrentCollection } from '../../hooks/collections';

export default function SideNav() {
  const location = window.location.href;
  console.log('location ', location);
  const [showCollectionTab, setShowCollectionTab] = useState(false);
  const [collection] = useCurrentCollection();

  return (
    <nav className="side-nav">
      <Link alt="Data Clinic" className="title" to="/">
        <h2 className="scout-h2">Scout</h2>

        <p className="scout-sub">by data clinic</p>
      </Link>
      <NavLink
        activeClassName="active-nav"
        alt="Explore"
        className="explore"
        exact
        to="/"
      >
        <FontAwesomeIcon size="2x" icon={faEye} />
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
          <FontAwesomeIcon size="2x" icon={faColumns} />
          <h1>Collections</h1>
        </button>
        <CollectionTab visible={showCollectionTab} />
      </div>
      <NavLink
        exact
        activeClassName="active-nav"
        alt="about"
        className="about"
        to="/about"
      >
        <FontAwesomeIcon size="2x" icon={faQuestionCircle} />
        <h1>About Data Clinic</h1>
      </NavLink>
    </nav>
  );
}
