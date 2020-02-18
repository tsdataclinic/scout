import React from 'react';
import RawHTML from '../components/RawHTML/RawHTML';

export function formatDate(date) {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return new Date(date).toLocaleDateString('en-US', options);
}

export function hilightMatches(text, query) {
  if (query) {
    const regex = new RegExp(`(${query})`, 'ig');
    return (
      <RawHTML
        html={text.replace(
          regex,
          (match) => `<span class="hilight">${match}</span>`,
        )}
      />
    );
  }
  return text;
}
