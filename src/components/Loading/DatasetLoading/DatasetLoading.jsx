import React from 'react';
import './DatasetLoading.scss';
import '../Loading.scss';

export default () => (
  <div className="dataset-loading">
    <div className="dataset-list">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="dataset">
          <div className="dataset-title animate" />
          <p className="dataset-description animate" />
          <div className="dataset-meta animate" />
        </div>
      ))}
    </div>
  </div>
);
