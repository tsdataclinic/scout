import { useState, useRef, useEffect } from 'react';
import lunr from 'lunr';

const parameterisedPlugin = function(builder, fields) {
  fields.forEach(function(field) {
    builder.field(field);
  });
};
function generateIndex(options, documents) {
  return lunr(function() {
    this.use(parameterisedPlugin, options.fields);

    documents.forEach(function(doc) {
      this.add(doc);
    }, this);
  });
}

function storeIndex(index, docLength) {
  return localStorage.setItem(
    'searchIndex',
    JSON.stringify({ docCount: docLength, cachedIndex: index }),
  );
}

export default function useLunr({ query, documents, options }) {
  const index = useRef(null);
  const [results, setResults] = useState([]);

  useEffect(() => {
    const cachedIndexStr = localStorage.getItem('searchIndex');
    if (cachedIndexStr) {
      const { docCount, cachedIndex } = JSON.parse(cachedIndexStr);
      if (docCount === documents.length || documents.length === 0) {
        console.log('USING CACHED INDEX ', cachedIndex);
        index.current = lunr.Index.load(cachedIndex);
      } else {
        console.log('REGENERATING INDEX BECAUSE DOCUMENTS CHANGED ');
        index.current = generateIndex(options, documents);
        storeIndex(index.current, documents.length);
      }
    } else {
      console.log('USING CACHED INDEX ');

      index.current = generateIndex(options, documents);
      storeIndex(index.current, documents.length);
    }
  }, [documents, options]);

  useEffect(() => {
    if (index.current) {
      try {
        setResults(index.current.search(query));
      } catch {
        console.log('ignoring bad query format');
      }
    }
  }, [query]);
  return results;
}
