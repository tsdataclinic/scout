import React from 'react';
import './TagSelector.scss';

export default function TagSelector({ tags, selected, onChange }) {
  const clearTags = () => {
    onChange([]);
  };

  const toggleTag = (tag) => {
    console.log('old tags ', selected);
    const newSelection = selected.includes(tag)
      ? selected.filter((t) => t !== tag)
      : [...selected, tag];

    console.log('new tags ', newSelection);
    onChange(newSelection);
  };

  return (
    <div className="tag-selector">
      <h2>Tags</h2>
      {tags && (
        <ul className="tag-list">
          {tags.map((tag) => (
            /* eslint-disable */
            <li
              className={selected.includes(tag) ? 'selected' : ''}
              onClick={() => toggleTag(tag)}
              key={tag}
            >
              {tag}
            </li>
            /* eslint-enable */
          ))}
        </ul>
      )}
      {selected.length > 0 && (
        <button type="button" onClick={clearTags}>
          clear
        </button>
      )}
    </div>
  );
}
