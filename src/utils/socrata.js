const SOCRATA_NY_OPENDATA_ENDPOINT =
  'https://api.us.socrata.com/api/catalog/v1?domains=data.cityofnewyork.us&search_context=data.cityofnewyork.us';

const ALLOWED_JOIN_COLUMNS = [
  'BIN',
  'BBL',
  'NTA',
  'Community Board',
  'Census Tract',
  'DBN',
  'Council District',
  'School Name',
  'City Council Districts',
  'DFTA ID',
];

async function getMaifestPage(pageNo, limit = 100) {
  return fetch(
    `${SOCRATA_NY_OPENDATA_ENDPOINT}&offset=${pageNo * limit}&limit=${limit}`,
  ).then((r) => r.json());
}

function matachableColumnsForDataset(dataset) {
  return new Set([
    ...dataset.resource.columns_name,
    ...dataset.resource.columns_field_name,
  ]);
}

function hasJoinableMatch(columns, candidate) {
  const candidateCols = matachableColumnsForDataset(candidate);
  const intersection = new Set(
    [...columns].filter(
      (x) => candidateCols.has(x), // && ALLOWED_JOIN_COLUMNS.includes(x),
    ),
  );
  return Array.from(intersection);
}

export function findJoinable(dataset, datasets) {
  const cols = matachableColumnsForDataset(dataset);
  const matches = datasets
    .map((candidate) => ({
      dataset: candidate,
      joinableColumns: hasJoinableMatch(cols, candidate),
    }))
    .filter(
      (match) =>
        match.joinableColumns.length > 0 &&
        match.dataset.resource.id !== dataset.resource.id,
    );
  return matches;
}

/**
 * Get the full manifest from Socrata. This should be cached locally and updated in a smart way.
 *
 * @return {Promise(Array)} a promise that resolves to an array of the datasets
 */
export async function getManifest() {
  const firstPage = await getMaifestPage(0, 1);
  const totalEntries = firstPage.resultSetSize;
  const pages = Math.ceil(totalEntries / 100);
  return Promise.all(
    [...Array(pages)].map((_, i) =>
      getMaifestPage(i).then((resp) => resp.results),
    ),
  ).then((list) =>
    list.reduce(
      (datasetPage, allDatasets) => [...allDatasets, ...datasetPage],
      [],
    ),
  );
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
  const tagList = datasets.reduce(
    (tags, dataset) => [
      ...tags,
      ...(dataset.classification.domain_tags
        ? dataset.classification.domain_tags
        : []),
    ],
    [],
  );
  const counts = tagList.reduce(
    (totals, tag) =>
      tag in totals
        ? { ...totals, [tag]: totals[tag] + 1 }
        : { ...totals, [tag]: 1 },
    {},
  );
  return counts;
}

export function getUniqueEntriesCount(dataset, column) {
  return fetch(
    `https://data.cityofnewyork.us/resource/${
      dataset.resource.id
    }.json?$select=distinct|> select count(*) ${column.replace(/ /g, '_')}`,
  ).then((r) => r.json());
}
export function getUniqueEntries(dataset, column) {
  return fetch(
    `https://data.cityofnewyork.us/resource/${
      dataset.resource.id
    }.json?$select=distinct ${column.replace(/ /g, '_')}`,
  )
    .then((r) => r.json())
    .then((r) => {
      return r.errorCode ? [] : r.map((entry) => Object.values(entry)[0]);
    });
}
