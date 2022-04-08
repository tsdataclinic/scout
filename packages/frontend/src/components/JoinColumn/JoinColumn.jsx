import { useState } from 'react';
import numeral from 'numeral';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile } from '@fortawesome/free-regular-svg-icons';
import {
  faTable,
  faAngleRight,
  faAngleDown,
} from '@fortawesome/free-solid-svg-icons';
import DatasetLink from '../DatasetLink/DatasetLink';
import './JoinColumn.scss';
import AddToCollectionButton from '../AddToCollectionButton';

export default function JoinColumn({ dataset, matches, matchPC }) {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className="join-column">
      <div className="join-column-row">
        <span
          onClick={() => setCollapsed(!collapsed)}
          onKeyDown={e => {
            if (e.key === ' ') {
              setCollapsed(!collapsed);
            }
          }}
          className="join-column-name"
          role="button"
          tabIndex="0"
        >
          <FontAwesomeIcon icon={collapsed ? faAngleRight : faAngleDown} />
          <FontAwesomeIcon icon={faFile} />
          {dataset.name}
        </span>
        <span>
          {matchPC === undefined ? '...' : numeral(matchPC).format('0%')} ids
          match
        </span>
        <span>
          <DatasetLink dataset={dataset}>View</DatasetLink>
        </span>
        <AddToCollectionButton datasetId={dataset.id} />
      </div>
      {!collapsed &&
        (matches ? (
          <div className="join-column-unique">
            <h3 style={{ textTransform: 'uppercase' }}>Common IDs</h3>
            <ul>
              {matches.slice(0, 10).map(uid => (
                <li key={String(uid)}>
                  <div className="bar" />
                  <FontAwesomeIcon icon={faTable} />
                  <span>
                    {uid === undefined ? (
                      <span style={{ fontStyle: 'italic' }}>null</span>
                    ) : (
                      uid
                    )}
                  </span>
                </li>
              ))}
            </ul>
            <div>
              {matches.length > 10 ? (
                <>
                  and{' '}
                  {matches.length - Math.min(10, matches.slice(0, 10).length)}{' '}
                  more
                </>
              ) : null}
            </div>
          </div>
        ) : (
          <h2>Loading</h2>
        ))}
    </div>
  );
}
