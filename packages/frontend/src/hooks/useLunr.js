import { useState, useRef, useEffect } from 'react';
import lunr from 'lunr';

const parameterisedPlugin = (builder, fields) => {
  fields.forEach(field => {
    builder.field(field);
  });
};

function generateIndex(options, documents) {
  return lunr(function generate() {
    this.use(parameterisedPlugin, options.fields);

    documents.forEach(function adder(doc) {
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
        index.current = lunr.Index.load(cachedIndex);
      } else {
        index.current = generateIndex(options, documents);
        storeIndex(index.current, documents.length);
      }
    } else {
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
