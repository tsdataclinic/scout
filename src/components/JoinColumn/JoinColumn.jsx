import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile } from '@fortawesome/free-regular-svg-icons';
import { Link } from 'react-router-dom';
import {
  faAngleRight,
  faAngleDown,
  faTable,
} from '@fortawesome/free-solid-svg-icons';
import { useCurrentCollection } from '../../hooks/collections';
import './JoinColumn.scss';

export default function ColumnJoin({ rightDataset, matches }) {
  const [collapsed, setCollapsed] = useState(true);
  const [
    collection,
    { addToCollection, removeFromCollection },
  ] = useCurrentCollection();

  return (
    <div className="join-column">
      <div className="join-column-row">
        <span
          onClick={() => setCollapsed(!collapsed)}
          onKeyDown={(e) => {
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
          {rightDataset.resource.name}
        </span>
        <span>
          {matches
            ? `~ ${Math.floor(
                (matches.matches.length * 100) / matches.leftSize,
              ).toLocaleString()} % ids match`
            : 'loading'}
        </span>
        <span>
          <Link to={`/dataset/${rightDataset.resource.id}`}>View</Link>
        </span>
        <button
          type="button"
          onClick={() =>
            collection.datasets.includes(rightDataset.resource.id)
              ? removeFromCollection(collection.id, rightDataset.resource.id)
              : addToCollection(collection.id, rightDataset.resource.id)
          }
        >
          {collection.datasets.includes(rightDataset.resource.id)
            ? 'Remove from collection'
            : 'Add to collection'}
        </button>
      </div>
      {!collapsed &&
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
        ))}
    </div>
  );
}
