import React from 'react';
import { Link } from 'react-router-dom';
import { Portals } from '../../portals';

export default function DatasetLink({ dataset, children, ...props }) {
  const { portal } = dataset;
  return (
    <Link {...props} to={`/${portal.abbreviation}/dataset/${dataset.id}`}>
      {children}
    </Link>
  );
}
