import React from 'react';
import { Link } from 'react-router-dom';
import { useCurrentCollection } from '../../hooks/collections';
import './CollectionBar.scss';

export default function CollectionContext() {
    const [collection, { clearCollection }] = useCurrentCollection();
    if (collection.datasets && collection.datasets.length > 0) {
        return (
            <div className="collection-bar">
                <span>{collection.datasets.length} datasets selected</span>
                <Link to="/collection/new">
                    <button type="submit">Create Collection</button>
                </Link>
                <button type="button" onClick={clearCollection}>
                    Clear
                </button>
            </div>
        );
    }
    return null;
}
