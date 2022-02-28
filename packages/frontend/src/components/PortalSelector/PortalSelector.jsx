import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import PortalInfo from '../PortalInfo/PortalInfo';

import './PortalSelector.scss';

const AVAILABLE_PORTALS = gql`
  query {
    portals {
      id
      name
      adminLevel
      abbreviation
    }
  }
`;

export default function PortalSelector({ selectedPortal }) {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const { loading, data } = useQuery(AVAILABLE_PORTALS);
  const portals = data ? data.portals : [];
  const [search, setSearch] = useState('');

  const selectPortal = portal => {
    setShowMenu(false);
    navigate(`/${portal.abbreviation}`);
  };

  const filteredPortals =
    search.length > 0
      ? portals.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
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
              onChange={e => setSearch(e.target.value)}
            />
            <ul>
              {Object.values(filteredPortals).map(portal => (
                <li key={portal.id}>
                  <div
                    tabIndex="0"
                    role="button"
                    onClick={() => selectPortal(portal)}
                    onKeyPress={() => selectPortal(portal)}
                  >
                    <PortalInfo portal={portal} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
