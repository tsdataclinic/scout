import React from 'react';
import DOMPurify from 'dompurify';

/* Simple component to sanitize HTML and display it.
 *  Need this for making sure we can display the
 *  dataset descriptions properly
 */

export default function RawHTML({ html, className }) {
  const cleanedHTML = DOMPurify.sanitize(html);
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: cleanedHTML }}
    />
  );
}
