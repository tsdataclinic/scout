import React from 'react';
import { Link } from 'react-router-dom';
import './Breadcrumb.scss';

const Breadcrumb = ({ currentPage }) => (
  <div className="Breadcrumb">
    <Link to="/">Home</Link>
    <span> / {currentPage}</span>
  </div>
);

export default Breadcrumb;
