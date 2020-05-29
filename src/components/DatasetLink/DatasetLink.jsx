import React from 'react';
import { Link } from 'react-router-dom';
import { PortalConfigs } from '../../portal_configs';

export default function DatasetLink({ dataset, children, ...props }) {
  const portal = dataset.portal ? dataset.portal : dataset.metadata.domain;
  const portalDetails = Object.entries(PortalConfigs).find(
    (c) => c[1].socrataDomain === portal,
  )[0];

  return (
    <Link
      {...props}
      to={`/${portalDetails}/dataset/${
        dataset.id ? dataset.id : dataset.resource.id
      }`}
    >
      {children}
    </Link>
  );
}
