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
  const [search, setSearch] = useState('');

  console.log(portals);

  const selectPortal = (portal) => {
    console.log('portal is ', portal);
    setShowMenu(false);
    history.push(`/${portal.abbreviation}`);
  };

  const filteredPortals =
    search.length > 0
      ? portals.filter((p) =>
          p.name.toLowerCase().includes(search.toLowerCase()),
        )
      : portals;

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
          <div className={`portal-menu ${showMenu ? 'show-menu' : ''}`}>
            <input
              type="text"
              placeholder="Filter portals"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <ul>
              {Object.values(filteredPortals).map((portal) => (
                <li onClick={() => selectPortal(portal)} key={portal.name}>
                  <PortalInfo portal={portal} />
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
