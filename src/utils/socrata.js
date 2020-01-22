const SOCRATA_NY_OPENDATA_ENDPOINT =
  'https://api.us.socrata.com/api/catalog/v1?domains=data.cityofnewyork.us&search_context=data.cityofnewyork.us';

async function getMaifestPage(pageNo, limit = 100) {
  return fetch(
    `${SOCRATA_NY_OPENDATA_ENDPOINT}&offset=${pageNo * limit}&limit=${limit}`
  ).then(r => r.json());
}

function matachableColumnsForDataset(dataset) {
  return new Set([
    ...dataset.resource.columns_name,
    ...dataset.resource.columns_field_name
  ]);
}

function hasJoinableMatch(columns, candidate) {
  const candidateCols = matachableColumnsForDataset(candidate);
  const intersection = new Set([...columns].filter(x => candidateCols.has(x)));
  return Array.from(intersection);
}

export function findJoinable(dataset, datasets) {
  const cols = matachableColumnsForDataset(dataset);
  const matches = datasets
    .map(candidate => ({
      dataset: candidate,
      joinableColumns: hasJoinableMatch(cols, candidate)
    }))
    .filter(
      match =>
        match.joinableColumns.length > 0 &&
        match.dataset.resource.id !== dataset.resource.id
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
      getMaifestPage(i).then(resp => resp.results)
    )
  ).then(list =>
    list.reduce(
      (datasetPage, allDatasets) => [...allDatasets, ...datasetPage],
      []
    )
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
        : [])
    ],
    []
  );
  const unique = Array.from(new Set(categories));
  return unique;
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
        : [])
    ],
    []
  );
  return Array.from(new Set(tagList));
}
