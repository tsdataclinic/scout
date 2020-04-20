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

export default function useLunr({ query, documents, options }) {
    const index = useRef(null);
    const [results, setResults] = useState([]);

    useEffect(() => {
        index.current = generateIndex(options, documents);
    }, [documents.map((d) => d.id).join('_')]);

    useEffect(() => {
        if (index.current) {
            try {
                setResults(index.current.search(query));
            } catch {
                console.log('ignoring bad query format');
            }
        }
    }, [query, index.current]);
    return results;
}
