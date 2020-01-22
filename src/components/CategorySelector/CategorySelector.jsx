import React from 'react';
import './CategorySelector.scss';

export default function CategorySelector({ categories, selected, onChange }) {
  const clearCategories = () => {
    onChange([]);
  };

  const toggleCategory = (cat) => {
    const newSelection = selected.includes(cat)
      ? selected.filter((c) => c !== cat)
      : [...selected, cat];

    onChange(newSelection);
  };

  return (
    <div className="category-selector">
      <h2>Categories</h2>
      <ul className="category-list">
        {categories.map((cat) => (
          /* eslint-disable */
          <li
            key={cat}
            onClick={() => toggleCategory(cat)}
            className={`category-buttons ${
              selected && selected.includes(cat) ? 'selected' : ''
            }`}
          >
            {cat}
          </li>
          /* eslint-enable */
        ))}
      </ul>
      {selected && selected.length > 0 && (
        <button type="button" onClick={clearCategories}>
          clear
        </button>
      )}
    </div>
  );
}
