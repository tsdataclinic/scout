const socrataEndpoint = (domain) =>
  `https://api.us.socrata.com/api/catalog/v1?domains=${domain}&search_context=${domain}`;
async function getMaifestPage(domain, pageNo, limit = 100) {
  return fetch(
    `${socrataEndpoint(domain)}&offset=${pageNo * limit}&limit=${limit}`,
  ).then((r) => r.json());
}

/**
 * Get the full manifest from Socrata. This should be cached locally and updated in a smart way.
 *
 * @return {Promise(Array)} a promise that resolves to an array of the datasets
 */
export async function getManifest(domain) {
  const firstPage = await getMaifestPage(domain, 0, 1);
  const totalEntries = firstPage.resultSetSize;
  const pages = Math.ceil(totalEntries / 100);
  return Promise.all(
    [...Array(pages)].map((_, i) =>
      getMaifestPage(domain, i).then((resp) => resp.results),
    ),
  ).then((list) =>
    list.reduce(
      (datasetPage, allDatasets) => [...allDatasets, ...datasetPage],
      [],
    ),
  );
}

/**
 * Extract from the datasets array, a unique set of columns.
 * @return {Array<string>} an array of unique categories
 */
export function getColumns(datasets) {
  const columnList = {};

  datasets.forEach((dataset) => {
    if (dataset.resource.columns_name) {
      dataset.resource.columns_name
        .map((c) => c.trim())
        .forEach((col) => {
          if (col in columnList) {
            columnList[col] += 1;
          } else {
            columnList[col] = 1;
          }
        });
    }
  });
  return columnList;
}

/**
 * Extract from the datasets array, a unique set of categories.
 * @return {Array<string>} an array of unique categories
 */
export function getCategories(datasets) {
  const categories = datasets.reduce(
    (cats, dataset) => [
      ...cats,
      ...(dataset.classification.categories
        ? dataset.classification.categories
        : []),
    ],
    [],
  );

  const counts = categories.reduce(
    (totals, cat) =>
      cat in totals
        ? { ...totals, [cat]: totals[cat] + 1 }
        : { ...totals, [cat]: 1 },
    {},
  );
  return counts;
}

/**
 * Extract from the datasets array, a unique set of categories.
 * @return {Array<string>} an array of unique categories
 */
export function getDepartments(datasets) {
  const departments = datasets
    .map((dataset) =>
      dataset.classification.domain_metadata.find(
        (md) => md.key === 'Dataset-Information_Agency',
      ),
    )
    .filter((d) => d)
    .map((d) => d.value);
  const counts = departments.reduce(
    (totals, department) =>
      department in totals
        ? { ...totals, [department]: totals[department] + 1 }
        : { ...totals, [department]: 1 },
    {},
  );
  return counts;
}
/**
 * Extract from the datasets array, a unique set of tags.
 * @return {Array<string>} an array of unique tags
 */
export function getTagList(datasets) {
  const tagList = {};

  datasets.forEach((dataset) => {
    if (dataset.classification.domain_tags) {
      dataset.classification.domain_tags.forEach((tag) => {
        if (tag in tagList) {
          tagList[tag] += 1;
        } else {
          tagList[tag] = 1;
        }
      });
    }
  });
  return tagList;
}

export function getUniqueEntriesCount(dataset, column) {
  const domain = dataset.portal;
  return fetch(
    `https://${domain}/resource/${
      dataset.id
    }.json?$select=distinct|> select count(*) ${column.replace(/ /g, '_')}`,
  ).then((r) => r.json());
}
export function getUniqueEntries(dataset, column) {
  const domain = dataset.portal;

  return fetch(
    `https://${domain}/resource/${
      dataset.id
    }.json?$select=distinct ${column.replace(/ /g, '_')}`,
  )
    .then((r) => r.json())
    .then((r) => {
      if (r.errorCode || r.error) {
        console.warn(
          'Failed to load unique entries for dataset ',
          dataset,
          ' column ',
          column,
        );
        return [];
      }
      return r.map((entry) => Object.values(entry)[0]);
    });
}

// Used to get the results from the direct API request in to the same format as the bulk request
export const datasetToDBLite = (dataset) => ({
  id: dataset.id,
  name: dataset.name,
  portal: dataset.domain,
  columns: [], // resource.columns_name.map((c) => c.trim()),
  columnFields: [], // resource.columns_field_name.map((c) => c.trim()),
  columnTypes: [], // resource.columns_datatype,
  metaDataUpdatedAt: dataset.metadataUpdatedAt,
  updatedAt: dataset.updatedAt,
  createdAt: dataset.createdAt,
  description: dataset.description,
  views: 0, // resource.page_views.page_views_total,
  categories: [], // classification.categories,
  domainCategory: null, // classification.domainCategory,
  tags: [], // classification.domain_tags,
  type: null,
  updateFrequency: null,
  department: null,
  permaLink: null,
  parentDatasetID: null,
  updatedAutomation: null,
  owner: null,
});
export const datasetToDB = (dataset) => {
  const { resource, metadata, classification } = dataset;
  const domain_metadata = classification
    ? classification.domain_metadata
    : null;

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
  };
};
