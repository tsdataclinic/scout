import React from 'react';
import './PortalInfo.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { iconForAdminLevel } from '../../portals';

export default function PortalInfo({ portal }) {
  const scaleIcon = portal ? iconForAdminLevel(portal.adminLevel) : null;

  return (
    <div className="portal-info">
      <FontAwesomeIcon icon={scaleIcon} />
      <p>{portal?.name}</p>
    </div>
  );
}
