import React, { createContext, useState, useEffect } from 'react';

const defaultState = {
  thematicSuggestions: { home: [], away: [] },
  joinNumbers: [],
};

export const SuggestionsContext = createContext(defaultState);

export const SuggestionsProvider = ({ portal, children }) => {
  const [thematicSuggestions, setThematicSuggestions] = useState(null);
  const [joinNumbers, setJoinNumbers] = useState(null);

  console.log('PORTAL OBJECT IS ', portal);
  const portalID = portal.abbreviation;

  useEffect(() => {
    if (portalID) {
      fetch(
        `${process.env.PUBLIC_URL}/metadata/${portalID}/similarity_metrics.json`,
      )
        .then((r) => r.json())
        .then((r) => setThematicSuggestions(r));

      fetch(
        `${process.env.PUBLIC_URL}/metadata/${portalID}/potential_join_numbers.json`,
      )
        .then((r) => r.json())
        .then((r) => setJoinNumbers(r));
    }
  }, [portalID]);

  console.log('thematic ', thematicSuggestions, ' join numbers ', joinNumbers);
  return (
    <SuggestionsContext.Provider value={{ thematicSuggestions, joinNumbers }}>
      {children}
    </SuggestionsContext.Provider>
  );
};
