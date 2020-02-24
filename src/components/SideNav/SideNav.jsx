import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SideNav.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faQuestionCircle,
    faEye,
    faColumns,
} from '@fortawesome/free-solid-svg-icons';
import CollectionTab from '../CollectionTab/CollectionTab';
import { useCurrentCollection } from '../../hooks/collections';


export default function SideNav() {
    const [showCollectionTab, setShowCollectionTab] = useState(false);
    const [collection] = useCurrentCollection();
    return (
        <nav className="side-nav">
            <Link alt="Data Clinic" className="title" to="/">
                <img
                    alt="Data Clinic logo"
                    src={`${process.env.PUBLIC_URL}/DataClinicLogo.png`}
                />
            </Link>

            <Link alt="Explore" className="explore" to="/">
                <FontAwesomeIcon size="2x" icon={faEye} />
                <h1>Explore</h1>
            </Link>
            <div style={{ position: 'relative' }}>
                {collection.datasets.length > 0 && (
                    <div className="collection-counter">
                        {collection.datasets.length}
                    </div>
                )}
                <button
                    onClick={() => setShowCollectionTab(!showCollectionTab)}
                    className="header-button"
                >
                    <FontAwesomeIcon size="2x" icon={faColumns} />
                    <h1>Collections</h1>
                </button>
                <CollectionTab visible={showCollectionTab} />
            </div>
            <Link alt="about" className="about">
                <FontAwesomeIcon size="2x" icon={faQuestionCircle} />
                <h1>About Data Clinic</h1>
            </Link>
        </nav>
    );
}
