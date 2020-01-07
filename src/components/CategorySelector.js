import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

const CategoryIcons = {
  infrastructure: 'building',
  'public safety': 'hard-hat',
  economy: 'chart-line',
  education: 'school',
  environment: 'tree',
  demographics: 'users',
  health: 'syringe',
  transportation: 'bus',
  finance: 'money-bill-alt',
  recreation: 'table-tennis',
  'housing & development': 'building',
  'social services': 'thumbs-up',
  politics: 'handshake',
};

export default function CategorySelector({categories, selected, onSelected}) {
  return (
    <ul className="categories">
      {categories.map(cat => (
        <li className="category-button">
          {cat}
          <FontAwesomeIcon icon={CategoryIcons[cat]} />
        </li>
      ))}
    </ul>
  );
}
