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
    const indices = matches.indices.filter((pair) => pair[1] - pair[0] > 1);

    const highlightedText = text.split('').map((char) => ({
      char,
      highlight: false,
    }));

    indices.forEach((pair) => {
      // eslint-disable-next-line no-plusplus
      for (let i = pair[0]; i < pair[1] + 1; i++) {
        highlightedText[i].highlight = true;
      }
    });

    let isHighlighting = false;
    let curResult = '';
    highlightedText.forEach(({ char, highlight }) => {
      if (isHighlighting) {
        if (highlight) {
          curResult += char;
        } else {
          isHighlighting = false;
          result.push(<span className="hilight">{curResult}</span>);
          curResult = char;
        }
      } else if (!highlight) {
        curResult += char;
      } else {
        isHighlighting = true;
        result.push(<span>{curResult}</span>);
        curResult = char;
      }
    });
    result.push(
      <span className={isHighlighting ? 'hilight' : ''}>{curResult}</span>,
    );

    return result;
  }
  return text;
}
