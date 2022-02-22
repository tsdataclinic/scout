import React from 'react';
import { Link } from 'react-router-dom';

export default function DatasetLink({ dataset, className, children }) {
  const { portal } = dataset;
  return (
    <Link
      className={className}
      to={`/${portal.abbreviation}/dataset/${dataset.id}`}
    >
      {children}
    </Link>
  );
}
