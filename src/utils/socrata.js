const SOCRATA_NY_OPENDATA_ENDPOINT =
  'http://api.us.socrata.com/api/catalog/v1?domains=data.cityofnewyork.us&search_context=data.cityofnewyork.us';

async function getMaifestPage(pageNo, limit = 100) {
  return fetch(
    `${SOCRATA_NY_OPENDATA_ENDPOINT}&offset=${pageNo * limit}&limit=${limit}`,
  ).then(r => r.json());
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
      getMaifestPage(i).then(resp => resp.results),
    ),
  ).then(list =>
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
  return Array.from(new Set(categories));
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
  return Array.from(new Set(tagList));
}
