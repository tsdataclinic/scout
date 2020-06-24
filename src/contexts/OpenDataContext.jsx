import React, { createContext, useContext, useReducer, useEffect } from 'react';
import lunr from 'lunr';
import Dexie from 'dexie';
import {
  getManifest,
  getCategories,
  getColumns,
  getTagList,
  getDepartments,
} from '../utils/socrata';

const db = new Dexie('SocrataCache');
new Dexie('Datasets');

const index = lunr(() => {});

const getTokenStream = (text) =>
  index.pipeline.run(lunr.tokenizer(text)).map((token) => token.str);

db.version(1).stores({
  Datasets:
    'id, name,portal, description, department, updatedAt, createdAt, *columns, *columnFields, *tags, classification, downloads, views, updateFrequency, updatedAutomation, *tokens',
});

new Dexie('Tags');
db.version(1).stores({
  Tags: 'name, count, portal',
});

new Dexie('Categories');
db.version(1).stores({
  Categories: 'name, count, portal',
});

new Dexie('Departments');
db.version(1).stores({
  Departments: 'name, count, portal',
});

new Dexie('Columns');
db.version(1).stores({
  Columns: 'name, count, portal',
});

db.version(1).stores({
  SocrataCache: '++id, portal',
});

function loadDepartmentsIntoDB(departments, portal) {
  db.Departments.bulkPut(
    Object.entries(departments).map(([department, count]) => ({
      name: department,
      count,
      portal,
    })),
  );
}

function loadCategoriesIntoDB(categories, portal) {
  db.Categories.bulkPut(
    Object.entries(categories).map(([category, count]) => ({
      name: category,
      count,
      portal,
    })),
  );
}
function loadTagsIntoDB(tags, portal) {
  db.Tags.bulkPut(
    Object.entries(tags).map(([tag, count]) => ({
      name: tag,
      count,
      portal,
    })),
  );
}

function loadColumnsIntoDB(columns, portal) {
  db.Columns.bulkPut(
    Object.entries(columns).map(([column, count]) => ({
      name: column,
      count,
      portal,
    })),
  );
}

function loadDatasetsIntoDB(datasets) {
  const serializedDatasets = datasets.map((dataset) => {
    // if (dataset.resource.id === 'c5dk-m6ea') {
    //   debugger;
    // }
    const { resource, metadata, classification } = dataset;
    const { domain_metadata } = classification;

    const updatedAutomation = domain_metadata?.find(
      ({ key, value }) => key === 'Update_Automation' && value === 'No',
    )?.value;

    const updateFrequency = domain_metadata?.find(
      ({ key }) => key === 'Update_Update-Frequency',
    )?.value;

    const department = domain_metadata?.find(
      ({ key }) => key === 'Dataset-Information_Agency',
    )?.value;

    return {
      id: resource.id,
      name: resource.name,
      portal: metadata.domain,
      columns: resource.columns_name,
      columnFields: resource.columns_field_name,
      columnTypes: resource.columns_datatype,
      metaDataUpdatedAt: resource.metadata_updated_at,
      updatedAt: resource.data_updated_at,
      createdAt: resource.createdAt,
      description: resource.description,
      views: resource.page_views.page_views_total,
      categories: classification.categories,
      domainCategory: classification.domainCategory,
      tags: classification.domain_tags,
      type: resource.type,
      updateFrequency,
      department,
      permaLink: dataset.permalink,
      parentDatasetID: resource.parent_fxf[0],
      updatedAutomation,
      owner: dataset.owner.display_name,
      tokens: getTokenStream(resource.name + resource.description),
    };
  });
  db.Datasets.bulkPut(serializedDatasets);
}

export const AppContext = createContext();

const initalState = {
  datasets: [],
  stateLoaded: false,
  lastUpdated: null,
};

const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'UPDATE_OPEN_DATASET_MANIFEST':
      return {
        ...state,
        datasets: payload.datasets,
        lastUpdated: payload.lastUpdated,
      };

    case 'HYDRATE_STATE':
      return { ...state, ...payload };

    case 'SET_LOADED':
      return { ...state, stateLoaded: true };
    default:
      return state;
  }
};

const updateManifestFromSocrata = (dispatch, portal) => {
  getManifest(portal.socrataDomain).then((manifest) => {
    const tagList = getTagList(manifest);
    const categories = getCategories(manifest);
    const departments = getDepartments(manifest);
    const columns = getColumns(manifest);
    loadDatasetsIntoDB(manifest, portal.socrataDomain);
    loadTagsIntoDB(tagList, portal.socrataDomain);
    loadDepartmentsIntoDB(departments, portal.socrataDomain);
    loadCategoriesIntoDB(categories, portal.socrataDomain);
    loadColumnsIntoDB(columns, portal.socrataDomain);

    dispatch({
      type: 'UPDATE_OPEN_DATASET_MANIFEST',
      payload: {
        datasets: manifest,
        lastUpdated: new Date(),
      },
    });
    dispatch({
      type: 'SET_LOADED',
    });
  });
};

// Checks to see if the cache is older than 1 daym if so update it
const shouldUpdateCache = (lastUpdated) => {
  if (lastUpdated == null) return true;
  if ((new Date() - lastUpdated) / 1000 > 24 * 60 * 60) return true;
  return false;
};

export const OpenDataProvider = ({ children, portal }) => {
  const [state, dispatch] = useReducer(reducer, initalState);

  // Try to get the state locally from indexed db... if we can't find it there, request it from the
  // socrata API
  //
  //
  useEffect(() => {
    console.log('state is ', state);
  }, [state]);

  // useEffect(()=>{
  //   db.Datasets.hook('creating',()=>{
  //     dispatch({
  //       type:'DATABASE_UPDATED'
  //     })
  //   })
  // })

  useEffect(() => {
    db.SocrataCache.get(portal.storageID).then((result) => {
      if (result) {
        const cachedState = JSON.parse(result.data);
        if (shouldUpdateCache(new Date(cachedState.lastUpdated))) {
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

  // If our datasets change, update the cahced version
  const { datasets, stateLoaded, lastUpdated } = state;
  useEffect(() => {
    if (stateLoaded) {
      db.SocrataCache.put({
        data: JSON.stringify({
          datasets,
          lastUpdated,
        }),
        id: portal.storageID,
      });
    }
  }, [datasets, stateLoaded, lastUpdated, portal]);

  return (
    <AppContext.Provider value={[{ ...state, portal }, dispatch, db]}>
      {children}
    </AppContext.Provider>
  );
};

export const useStateValue = () => useContext(AppContext);
