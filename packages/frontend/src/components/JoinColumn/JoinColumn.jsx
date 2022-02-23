import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile } from '@fortawesome/free-regular-svg-icons';
import { faAngleRight, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import DatasetLink from '../DatasetLink/DatasetLink';
import { useUserCollections } from '../../hooks/collections';
import './JoinColumn.scss';

export default function ColumnJoin({ dataset }) {
  const [collapsed, setCollapsed] = useState(true);
  const [
    ,
    {
      addToCurrentCollection,
      removeFromCurrentCollection,
      inCurrentCollection,
    },
  ] = useUserCollections();

  return (
    <div className="join-column">
      <div className="join-column-row">
        <span
          onClick={() => setCollapsed(!collapsed)}
          onKeyDown={e => {
            if (e.keycode === 32) {
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
          {(Math.random() * 100).toLocaleString({
            maximumSignificantDigits: 1,
          })}{' '}
          % ids match
        </span>
        <span>
          <DatasetLink dataset={dataset}>View</DatasetLink>
        </span>
        <button
          type="button"
          onClick={() =>
            inCurrentCollection(dataset.id)
              ? removeFromCurrentCollection(dataset.id)
              : addToCurrentCollection(dataset.id)
          }
        >
          {inCurrentCollection(dataset.id)
            ? 'Remove from collection'
            : 'Add to collection'}
        </button>
      </div>
      {/* {!collapsed &&
        (matches ? (
          <div className="join-column-unique">
            <h3>COMMON IDS</h3>
            <ul>
              {matches.matches.slice(0, 10).map((uid) => (
                <li key={uid}>
                  <div className="bar" />
                  <FontAwesomeIcon icon={faTable} />
                  <span>{uid}</span>
                </li>
              ))}
            </ul>
            <div>
              and{' '}
              {matches.matches.length -
                Math.min(10, matches.matches.slice(0, 10).length)}{' '}
              more
            </div>
          </div>
        ) : (
          <h2>Loading</h2>
        ))} */}
    </div>
  );
}
