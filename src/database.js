import lunr from 'lunr';
import Dexie from 'dexie';

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
  db.Departments.bulkPut(
    Object.entries(departments).map(([department, count]) => ({
      name: department,
      count,
      portal,
    })),
  );
}

export function loadCategoriesIntoDB(categories, portal) {
  db.Categories.bulkPut(
    Object.entries(categories).map(([category, count]) => ({
      name: category,
      count,
      portal,
    })),
  );
}
export function loadTagsIntoDB(tags, portal) {
  db.Tags.bulkPut(
    Object.entries(tags).map(([tag, count]) => ({
      name: tag,
      count,
      portal,
    })),
  );
}

export function loadColumnsIntoDB(columns, portal) {
  db.Columns.bulkPut(
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
      columns: resource.columns_name.map((c) => c.trim()),
      columnFields: resource.columns_field_name.map((c) => c.trim()),
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
      tokens: getTokenStream(resource.name + resource.description, index),
    };
  });

  db.Datasets.bulkPut(serializedDatasets);
}
