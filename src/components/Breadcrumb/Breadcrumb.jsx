import React from 'react';
import { Link } from 'react-router-dom';
import './Breadcrumb.scss';

function Breadcrumb({ currentPage }) {
  return (
    <div className="Breadcrumb">
      <Link to="/">Home</Link>
      <span> / {currentPage}</span>
    </div>
  );
}

export default Breadcrumb;
