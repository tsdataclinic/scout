import React from 'react';

export function formatDate(date) {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return new Date(date).toLocaleDateString('en-US', options);
}

export function hilightMatches(text, matches) {
  if (matches) {
    const result = [];
    const indices = matches.indices.filter((pair) => pair[1] - pair[0] > 2);

    indices.forEach((pair, index) => {
      result.push(
        <span className="hilight">{text.slice(pair[0], pair[1])}</span>,
      );
      const nextPairStart =
        index + 1 < indices.length ? indices[index + 1][0] : text.length;
      result.push(<span>{text.slice(pair[1], nextPairStart)}</span>);
    });
    return result;
  }
  return text;
}
