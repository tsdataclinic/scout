import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import { Portals } from '../../portals';
import PortalInfo from '../PortalInfo/PortalInfo';

import './PortalSelector.scss';

const AVAILABLE_PORTALS = gql`
  query {
    portals {
      name
      adminLevel
      abbreviation
    }
  }
`;

export default function PortalSelector({ selectedPortal }) {
  const [showMenu, setShowMenu] = useState(false);
  const history = useHistory();
  const { loading, error, data } = useQuery(AVAILABLE_PORTALS);
  const portals = data ? data.portals : [];

  const selectPortal = (portal) => {
    console.log('portal is ', portal);
    setShowMenu(false);
    history.push(`/${portal.abbreviation}`);
  };

  return (
    <div className="portal-selector">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <button
            type="submit"
            onClick={() => setShowMenu(!showMenu)}
            className="show-menu"
          >
            <PortalInfo portal={selectedPortal} />
          </button>
          <ul className={`portal-menu ${showMenu ? 'show-menu' : ''}`}>
            {Object.values(portals).map((portal) => (
              <li onClick={() => selectPortal(portal)} key={portal.name}>
                <PortalInfo portal={portal} />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
