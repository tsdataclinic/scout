import React, { createContext, useState, useEffect } from 'react';

const defaultState = {
  thematicSuggestions: { home: [], away: [] },
  joinNumbers: [],
};

export const SuggestionsContext = createContext(defaultState);

export function SuggestionsProvider({ portal, children }) {
  const [thematicSuggestions, setThematicSuggestions] = useState(null);
  const [joinNumbers, setJoinNumbers] = useState(null);
  const portalId = portal ? portal.abbreviation : null;

  // TODO: best to have this be a backend endpoint rather than downloading
  // several JSON's to the frontend. This will really suffer when we switch
  // to showing all portals instead of just a single one.
  useEffect(() => {
    if (portalId) {
      fetch(
        `${process.env.PUBLIC_URL}/metadata/${portalId}/similarity_metrics.json`,
      )
        .then(r => r.json())
        .then(r => setThematicSuggestions(r));

      fetch(
        `${process.env.PUBLIC_URL}/metadata/${portalId}/potential_join_numbers.json`,
      )
        .then(r => r.json())
        .then(r => setJoinNumbers(r));
    }
  }, [portalId]);

  const context = React.useMemo(
    () => ({ thematicSuggestions, joinNumbers }),
    [thematicSuggestions, joinNumbers],
  );

  return (
    <SuggestionsContext.Provider value={context}>
      {children}
    </SuggestionsContext.Provider>
  );
}
