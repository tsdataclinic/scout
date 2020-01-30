import React, { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile } from '@fortawesome/free-regular-svg-icons';
import { Link } from 'react-router-dom';
import {
  faAngleRight,
  faAngleDown,
  faTable,
} from '@fortawesome/free-solid-svg-icons';
import { useUniqueColumnEntries } from '../../hooks/datasets';
import useCollection from '../../hooks/collections';
import './JoinColumn.scss';

export default function ColumnJoin({ rightDataset, joinCol, parentUniques }) {
  const [collapsed, setCollapsed] = useState(true);
  const uniqueIds = useUniqueColumnEntries(rightDataset, joinCol);
  const jointlyUnique = useMemo(
    () =>
      uniqueIds && parentUniques
        ? parentUniques.filter((e) => uniqueIds.distinct.includes(e))
        : [],
    [uniqueIds, parentUniques],
  );
  const [
    collection,
    { addToCollection, removeFromCollection },
  ] = useCollection();

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
          {jointlyUnique ? `${jointlyUnique.length} matching id's` : 'loading'}
        </span>
        <span>
          <Link to={`/dataset/${rightDataset.resource.id}`}>View dataset</Link>
        </span>
        <button
          type="button"
          onClick={() =>
            collection.datasets.includes(rightDataset.resource.id)
              ? removeFromCollection(rightDataset.resource.id)
              : addToCollection(rightDataset.resource.id)
          }
        >
          {collection.datasets.includes(rightDataset.resource.id)
            ? 'Remove dataset from collection'
            : 'Add dataset to collection'}
        </button>
      </div>
      {!collapsed && uniqueIds && (
        <div className="join-column-unique">
          <h3>COMMON IDS</h3>
          <ul>
            {jointlyUnique.slice(0, 10).map((uid) => (
              <li key={uid}>
                <div className="bar" />
                <FontAwesomeIcon icon={faTable} />
                <span>{uid}</span>
              </li>
            ))}
          </ul>
          <div>and {jointlyUnique.length - 10} more</div>
        </div>
      )}
    </div>
  );
}
