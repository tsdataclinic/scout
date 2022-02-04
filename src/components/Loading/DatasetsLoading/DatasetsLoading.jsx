import React from 'react';
import './DatasetsLoading.scss';
import '../Loading.scss';

export default function DatasetsLoading() {
  return (
    <div className="datasets-loading">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="dataset">
          <div className="dataset-title animate" />
          <p className="dataset-description animate" />
          <div className="dataset-meta animate" />
        </div>
      ))}
    </div>
  );
}
