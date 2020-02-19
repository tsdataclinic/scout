import React from 'react';
import { Link } from 'react-router-dom';
import './SideNav.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faQuestionCircle,
  faEye,
  faColumns,
} from '@fortawesome/free-solid-svg-icons';

export default function SideNav() {
  return (
    <nav className="side-nav">
      <Link  alt="Data Clinic" className="title" to="/">
          <img alt="Data Clinic logo" src={`${process.env.PUBLIC_URL}/DataClinicLogo.png`} />
      </Link>
      <Link alt="Explore" className="explore" to="/">
        <FontAwesomeIcon size="lg" icon={faEye} />
        <h1>Explore</h1>
      </Link>
      <Link alt="collections" className="collections">
        <FontAwesomeIcon size="lg" icon={faColumns} />
        <h1>Collections</h1>
      </Link>
      <Link alt="about" className="about">
        <FontAwesomeIcon size="lg" icon={faQuestionCircle} />
        <h1>About Data Clinic</h1>
      </Link>
    </nav>
  );
}
