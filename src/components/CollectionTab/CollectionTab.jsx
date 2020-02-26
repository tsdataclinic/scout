import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useGetDatasetsByIds } from '../../hooks/datasets';
import { useCollections, useCurrentCollection } from '../../hooks/collections';
import { constructCollectionLink } from '../../utils/formatters';

import './CollectionTab.scss';

export default function CollectionTab({ visible }) {
    const collections = useCollections();
    const [
        collection,
        { removeFromCollection, createCollectionFromPending },
    ] = useCurrentCollection();
    const currentCollectionDatasets = useGetDatasetsByIds(collection.datasets);
    const [newCollectionName, setNewCollectionName] = useState('');
    const [tab, setTab] = useState('new');
    const [showCreate, setShowCreate] = useState(false);

    const createCollection = () => {
        createCollectionFromPending(newCollectionName);
        setShowCreate(false);
    };

    const getAgency = (dataset) => {
        return dataset?.classification.domain_metadata?.find(
            ({ key }) => key === 'Dataset-Information_Agency',
        )?.value;
    };

    if (!visible) return '';

    return (
        <div className="collection-tab">
            {showCreate ? (
                <div className="collections-tab-create">
                    <h2>Create Collection</h2>
                    <div className="collections-tab-create-options">
                        <p>Name your new collection</p>
                        <input
                            placeholder="name"
                            type="text"
                            value={newCollectionName}
                            onChange={(e) =>
                                setNewCollectionName(e.target.value)
                            }
                        />
                        <ul>
                            {currentCollectionDatasets.map((c) => (
                                <li className="collection-tab-dataset">
                                    <div>
                                        <p className="name">
                                            {c.resource.name}
                                        </p>
                                        <p className="agency">
                                            {' '}
                                            {getAgency(c)}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="collection-tab-buttons">
                        <button type="submit" onClick={createCollection}>
                            Create
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowCreate(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div className="collections-tab-view">
                    <h2>Collections</h2>
                    <div className="collection-tab-tabs">
                        <button
                            type="button"
                            onClick={() => setTab('new')}
                            className={`header-button' ${
                                tab === 'new' ? 'selected' : ''
                            }`}
                        >
                            Create new
                        </button>
                        <button
                            type="button"
                            onClick={() => setTab('existing')}
                            className={`header-button' ${
                                tab === 'existing' ? 'selected' : ''
                            }`}
                        >
                            Existing Collections
                        </button>
                    </div>
                    {tab === 'new' && (
                        <>
                            <div className="collection-tab-current-collection">
                                {currentCollectionDatasets.length === 0 ? (
                                    <div className="datasets-placeholder">
                                        <h3>No datasets selected</h3>
                                        <p>
                                            Select `&quot;`Add to
                                            Collection`&quot;` to begin creating
                                            local collections.
                                        </p>
                                    </div>
                                ) : (
                                    <ul>
                                        {currentCollectionDatasets.map((d) => (
                                            <li
                                                key={d.resource.name}
                                                className="collection-tab-dataset"
                                            >
                                                <div>
                                                    <p className="name">
                                                        {d.resource.name}
                                                    </p>
                                                    <p className="agency">
                                                        {getAgency(d)}
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeFromCollection(
                                                            collection.id,
                                                            d.resource.id,
                                                        )
                                                    }
                                                >
                                                    Remove
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div className="collection-tab-buttons">
                                <button
                                    type="submit"
                                    onClick={() => setShowCreate(true)}
                                >
                                    Create Collection
                                </button>
                            </div>
                        </>
                    )}
                    {tab === 'existing' && (
                        <div className="collections-tab-existing-collections">
                            {collections.collections.length === 1 ? (
                                <div className="datasets-placeholder">
                                    <h3>No collections yet</h3>
                                </div>
                            ) : (
                                <ul className="existing-collections-list">
                                    {collections.collections
                                        .filter((c) => c.id !== 'pending')
                                        .map((c) => (
                                            <li className="existing-collection">
                                                <div className="exisiting-colections-deets">
                                                    <p className="name">
                                                        {c.name}
                                                    </p>
                                                    <p className="dataset-count">
                                                        {' '}
                                                        {c.datasets.length}{' '}
                                                        datasets{' '}
                                                    </p>
                                                </div>
                                                <Link
                                                    to={constructCollectionLink(
                                                        c,
                                                    )}
                                                >
                                                    <FontAwesomeIcon
                                                        size="2x"
                                                        icon={faEye}
                                                    />
                                                </Link>
                                            </li>
                                        ))}
                                </ul>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
