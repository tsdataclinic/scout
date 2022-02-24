import React, { createContext, useState, useEffect } from 'react';

const defaultState = {
  thematicSuggestions: { home: [], away: [] },
  joinNumbers: [],
};

export const SuggestionsContext = createContext(defaultState);

export function SuggestionsProvider({ portal, children }) {
  const [thematicSuggestions, setThematicSuggestions] = useState(null);
  const [joinNumbers, setJoinNumbers] = useState(null);
  const portalID = portal ? portal.abbreviation : null;

  useEffect(() => {
    if (portalID) {
      fetch(
        `${process.env.PUBLIC_URL}/metadata/${portalID}/similarity_metrics.json`,
      )
        .then(r => r.json())
        .then(r => setThematicSuggestions(r));

      fetch(
        `${process.env.PUBLIC_URL}/metadata/${portalID}/potential_join_numbers.json`,
      )
        .then(r => r.json())
        .then(r => setJoinNumbers(r));
    }
  }, [portalID]);

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
