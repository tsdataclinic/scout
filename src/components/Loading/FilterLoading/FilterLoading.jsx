import React from 'react';
import './FilterLoading.scss';
import '../Loading.scss';

export default () => (
  <div className="">
    <div className="filter-loading-wrapper">
      {[...Array(10)].map((_, i) => (
        <li key={i} className="multi-buttons">
          <input type="checkbox" disabled className="checkbox" />
          <span className="animate item-name" />
          <span className="animate pill" />
        </li>
      ))}
    </div>
  </div>
);
