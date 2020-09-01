import lunr from 'lunr';
import Dexie from 'dexie';
import { datasetToDB } from './utils/socrata';

export const db = new Dexie('SocrataCache');

db.version(1).stores({
  Datasets:
    'id, name,portal, description, department, updatedAt, createdAt, *columns, *columnFields, *tags, classification, downloads, views, updateFrequency, updatedAutomation, *tokens',
  Tags: 'name, count, portal',
  Categories: 'name, count, portal',
  Departments: 'name, count, portal',
  Columns: 'name, count, portal',
  SocrataCache: '++id, portal',
});

export function loadDepartmentsIntoDB(departments, portal) {
  return db.Departments.bulkPut(
    Object.entries(departments).map(([department, count]) => ({
      name: department,
      count,
      portal,
    })),
  );
}

export function loadCategoriesIntoDB(categories, portal) {
  return db.Categories.bulkPut(
    Object.entries(categories).map(([category, count]) => ({
      name: category,
      count,
      portal,
    })),
  );
}
export function loadTagsIntoDB(tags, portal) {
  return db.Tags.bulkPut(
    Object.entries(tags).map(([tag, count]) => ({
      name: tag,
      count,
      portal,
    })),
  );
}

export function loadColumnsIntoDB(columns, portal) {
  return db.Columns.bulkPut(
    Object.entries(columns).map(([column, count]) => ({
      name: column,
      count,
      portal,
    })),
  );
}

const getTokenStream = (text, index) =>
  index.pipeline.run(lunr.tokenizer(text)).map((token) => token.str);

export function loadDatasetsIntoDB(datasets) {
  const index = lunr(() => {});

  const serializedDatasets = datasets.map((dataset) => {
    const dbFormat = datasetToDB(dataset);
    return {
      ...dbFormat,
      tokens: getTokenStream(
        dataset.resource.name + dataset.resource.description,
        index,
      ),
    };
  });

  return db.Datasets.bulkPut(serializedDatasets);
}
