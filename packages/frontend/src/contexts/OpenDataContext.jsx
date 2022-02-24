import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { db } from '../database';
import { getManifest } from '../utils/socrata';

import DBWorker from '../workers/database.worker';

export const AppContext = createContext();

const initalState = {
  stateLoaded: false,
  lastUpdated: [],
  datasetsRefreshedAt: null,
  tagsRefreshedAt: null,
  columnsRefreshedAt: null,
  departmentsRefreshedAt: null,
  categoriesRefreshedAt: null,
};

const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'HYDRATE_STATE':
      return { ...state, ...payload };
    case 'DATASETS_UPDATED':
      return { ...state, datasetsRefreshedAt: new Date() };
    case 'TAGS_UPDATED':
      return { ...state, tagsRefreshedAt: new Date() };
    case 'COLUMNS_UPDATED':
      return { ...state, columnsRefreshedAt: new Date() };
    case 'DEPARTMENTS_UPDATED':
      return { ...state, departmentsRefreshedAt: new Date() };
    case 'CATEGORIES_UPDATED':
      return { ...state, categoriesRefreshedAt: new Date() };
    case 'SET_LOADED':
      return { ...state, stateLoaded: true };
    case 'SET_PORTAL_UPDATED':
      return {
        ...state,
        lastUpdated: state.lastUpdated.map(l => l.portal).includes(payload)
          ? state.lastUpdated.map(l =>
              l.portal === payload ? { ...l, updated_at: new Date() } : l,
            )
          : [...state.lastUpdated, { portal: payload, updated_at: new Date() }],
      };
    default:
      return state;
  }
};

const updateManifestFromSocrata = (dispatch, portal) => {
  const worker = new DBWorker();
  getManifest(portal.socrataDomain).then(manifest => {
    worker.postMessage({ manifest, portal });
    worker.addEventListener('message', message => {
      console.log('worker message ', message);
      if (message.data.event === 'database_updated') {
        switch (message.data.table) {
          case 'datasets':
            dispatch({
              type: 'DATASETS_UPDATED',
            });
            dispatch({
              type: 'SET_LOADED',
            });
            dispatch({
              type: 'SET_PORTAL_UPDATED',
              payload: portal.socrataDomain,
            });
            break;
          case 'tags':
            dispatch({
              type: 'TAGS_UPDATED',
            });
            break;
          case 'departments':
            dispatch({
              type: 'DEPARTMENTS_UPDATED',
            });
            break;
          case 'columns':
            dispatch({
              type: 'COLUMNS_UPDATED',
            });
            break;
          case 'categories':
            dispatch({
              type: 'CATEGORIES_UPDATED',
            });
            break;
          default:
            throw new Error(
              `Failed to match against any type. Received: ${message.data.table}`,
            );
        }
      }
      if (message.data.event === 'all_loaded') {
        dispatch({
          type: 'DATABASE_UPDATED',
        });

        dispatch({
          type: 'SET_PORTAL_UPDATED',
          payload: portal.socrataDomain,
        });
      }
    });
  });
};

// Checks to see if the cache is older than 1 daym if so update it
const shouldUpdateCache = lastUpdated => {
  if (lastUpdated == null) return true;
  if ((new Date() - lastUpdated) / 1000 > 24 * 60 * 60) return true;
  return false;
};

export function OpenDataProvider({ children, portal }) {
  const [state, dispatch] = useReducer(reducer, initalState);

  // Try to get the state locally from indexed db... if we can't find it there, request it from the
  // socrata API
  //
  //

  // useEffect(()=>{
  //   db.Datasets.hook('creating',()=>{
  //     dispatch({
  //       type:'DATABASE_UPDATED'
  //     })
  //   })
  // })

  useEffect(() => {
    if (!portal) {
      return;
    }
    db.SocrataCache.get(0).then(result => {
      if (result) {
        const cachedState = JSON.parse(result.data);
        const lastUpdateForPortal = cachedState.lastUpdated.find(
          p => p.portal === portal.socrataDomain,
        );
        if (
          shouldUpdateCache(
            lastUpdateForPortal
              ? new Date(lastUpdateForPortal.updated_at)
              : null,
          )
        ) {
          updateManifestFromSocrata(dispatch, portal);
        } else {
          dispatch({
            type: 'HYDRATE_STATE',
            payload: {
              ...initalState,
              ...cachedState,
              cache_loaded: true,
            },
          });
          // Set state as loaded to indicate that data is ready to use
          dispatch({
            type: 'SET_LOADED',
          });
        }
      } else {
        updateManifestFromSocrata(dispatch, portal);
      }
    });
  }, [portal]);

  // useEffect(() => {
  //   const refreshDB = () => {
  //     // debounce(() => {
  //     dispatch({
  //       type: 'DATABASE_UPDATED',
  //     });
  //     // }, 1000);
  //   };
  //   db.Datasets.hook('updating', refreshDB);
  //   db.Datasets.hook('creating', refreshDB);

  //   return () => {
  //     db.Datasets.hook('updating').unsubscribe(refreshDB);
  //     db.Datasets.hook('creating').unsubscribe(refreshDB);
  //   };
  // }, []);

  // If our datasets change, update the cahced version

  useEffect(() => {}, [portal]);
  const { stateLoaded, lastUpdated } = state;
  useEffect(() => {
    if (stateLoaded) {
      db.SocrataCache.put({
        data: JSON.stringify({
          lastUpdated,
        }),
        id: 0,
      });
    }
  }, [stateLoaded, lastUpdated, portal]);

  const context = React.useMemo(
    () => [{ ...state, portal }, dispatch, db],
    [state, portal, dispatch],
  );

  return <AppContext.Provider value={context}>{children}</AppContext.Provider>;
}

export const useStateValue = () => useContext(AppContext);
