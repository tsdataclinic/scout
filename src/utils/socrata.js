const NYDomain = 'data.ny.gov';
const NYCDomain = 'data.cityofnewyork.us';
export const domain = NYCDomain;
const SOCRATA_NY_OPENDATA_ENDPOINT = `https://api.us.socrata.com/api/catalog/v1?domains=${domain}&search_context=data.cityofnewyork.us`;

async function getMaifestPage(pageNo, limit = 100) {
    return fetch(
        `${SOCRATA_NY_OPENDATA_ENDPOINT}&offset=${pageNo *
            limit}&limit=${limit}`,
    ).then((r) => r.json());
}

function matachableColumnsForDataset(dataset) {
    return new Set([
        ...dataset.resource.columns_name.map((s) => s.toLocaleLowerCase()),
        ...dataset.resource.columns_field_name.map((s) =>
            s.toLocaleLowerCase(),
        ),
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
