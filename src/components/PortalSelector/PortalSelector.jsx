import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Portals } from '../../portals';
import PortalInfo from '../PortalInfo/PortalInfo';
import './PortalSelector.scss';

export default function PortalSelector({ selectedPortal }) {
  const [showMenu, setShowMenu] = useState(false);
  const history = useHistory();

  const selectPortal = (portal) => {
    setShowMenu(false);
    history.push(`/${portal.urlSuffix}`);
  };
  return (
    <div className="portal-selector">
      <button
        type="submit"
        onClick={() => setShowMenu(!showMenu)}
        className="show-menu"
      >
        <PortalInfo portal={selectedPortal} />
      </button>
      <ul className={`portal-menu ${showMenu ? 'show-menu' : ''}`}>
        {Object.values(Portals).map((portal) => (
          <li onClick={() => selectPortal(portal)} key={portal.name}>
            <PortalInfo portal={portal} />
          </li>
        ))}
      </ul>
    </div>
  );
}
