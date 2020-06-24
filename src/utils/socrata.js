import { PortalConfigs, DEFAULT_PORTAL } from '../portal_configs';

const socrataEndpoint = (domain) => {
  return `https://api.us.socrata.com/api/catalog/v1?domains=${domain}&search_context=${domain}`;
};
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
  ).then((list) => {
    return list.reduce(
      (datasetPage, allDatasets) => [...allDatasets, ...datasetPage],
      [],
    );
  });
}

/**
 * Extract from the datasets array, a unique set of columns.
 * @return {Array<string>} an array of unique categories
 */
export function getColumns(datasets) {
  const columnList = {};

  datasets.forEach((dataset) => {
    if (dataset.resource.columns_name) {
      dataset.resource.columns_name.forEach((col) => {
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

export function getUniqueEntriesCount(
  dataset,
  column,
  portalID = DEFAULT_PORTAL,
) {
  const domain = dataset.portal;
  return fetch(
    `https://${domain}/resource/${
      dataset.id
    }.json?$select=distinct|> select count(*) ${column.replace(/ /g, '_')}`,
  ).then((r) => r.json());
}
export function getUniqueEntries(dataset, column, portalID = DEFAULT_PORTAL) {
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
