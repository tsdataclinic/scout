import { useState, useRef, useEffect } from 'react';
import lunr from 'lunr';

const parameterisedPlugin = function setupFields(builder, fields) {
  fields.forEach(field => {
    builder.field(field);
  });
};

function generateIndex(options, documents) {
  return lunr(function lunrCallback() {
    this.use(parameterisedPlugin, options.fields);

    documents.forEach(function docCallback(doc) {
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
    // TODO(jps327): find safe way to remove this eslint-disable
    // eslint-disable-next-line
  }, [documents.map(d => d.id).join('_')]);

  useEffect(() => {
    if (index.current) {
      try {
        setResults(index.current.search(query));
      } catch {
        console.error('ignoring bad query format');
      }
    }
    // TODO(jps327): find safe way to remove this eslint-disable
    // eslint-disable-next-line
  }, [query, index.current]);
  return results;
}
