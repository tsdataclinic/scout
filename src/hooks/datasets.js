import { useMemo, useState, useEffect } from 'react';
import useLunr from './useLunr';
import { useStateValue } from '../contexts/OpenDataContext';
import { getUniqueEntries } from '../utils/socrata';

export function useStateLoaded() {
  const [{ stateLoaded }] = useStateValue();
  return stateLoaded;
}

function useFilterType(collectionName, domain) {
  const [collection, setCollection] = useState([]);
  const [{ portal }, , db] = useStateValue();

  const actualDomain = domain || portal.socrataDomain;
  useEffect(() => {
    if (actualDomain) {
      db[collectionName].where({ portal: actualDomain }).toArray((result) => {
        setCollection(result);
      });
    }
  }, [actualDomain, collectionName, db]);
  return collection;
}
export function useTags() {
  return useFilterType('Tags');
}

export function useCategories() {
  return useFilterType('Categories');
}

export function useDepartments() {
  return useFilterType('Departments');
}

export function useColumns() {
  const cols = useFilterType('Columns');
  return cols;
}

export function useJoinableDatasets(dataset) {
  const [potentialJoins, setPotentialJoins] = useState(null);

  const [, , db] = useStateValue();

  useEffect(() => {
    if (dataset && dataset.columnFields) {
      db.Datasets.where('columnFields')
        .anyOf(dataset.columnFields)
        .distinct()
        .toArray()
        .then((results) => {
          setPotentialJoins(results);
        });
    }
  }, [dataset, db.Datasets]);
  return potentialJoins;
}

export function useGetJoinNumbers(datasetID, portalID) {
  const [joinNumbers, setJoinNumbers] = useState({});
  useEffect(() => {
    fetch(
      `${process.env.PUBLIC_URL}/metadata/${portalID}/potential_join_numbers.json`,
    )
      .then((r) => r.json())
      .then((r) => setJoinNumbers(r));
  }, [portalID]);
  return datasetID in joinNumbers ? joinNumbers[datasetID] : 0;
}

export function useGetSimilarDatasets(datasetID, portalID) {
  const [similarityMetrics, setSimilarityMetrics] = useState({});
  const [{ datasets }] = useStateValue();

  useEffect(() => {
    fetch(
      `${process.env.PUBLIC_URL}/metadata/${portalID}//similarity_metrics.json`,
    )
      .then((r) => r.json())
      .then((r) => setSimilarityMetrics(r));
  }, [portalID]);

  const similarDatasets = useMemo(
    () =>
      similarityMetrics[datasetID] && datasets && datasets.length > 0
        ? similarityMetrics[datasetID].map((match) => ({
            similarity: match.similarity,
            dataset: datasets.find((d) => d.resource.id === match.dataset),
          }))
        : [],

    [similarityMetrics, datasetID, datasets],
  );
  return similarDatasets;
}

export function useDatasetCount() {
  const [noDatasets, setNoDatasets] = useState(0);
  const [, , db] = useStateValue();

  useEffect(() => {
    db.Datasets.count().then((count) => setNoDatasets(count));
  }, [db.Datasets]);
  return noDatasets;
}

export function useDataset(datasetID) {
  const [dataset, setDataset] = useState(null);
  const [, , db] = useStateValue();

  useEffect(() => {
    if (datasetID) {
      db.Datasets.get({ id: datasetID }).then((dataset) => setDataset(dataset));
    }
  }, [datasetID, db.Datasets]);
  return dataset;
}

export function useGetDatasetsByIds(ids) {
  const [{ datasets }] = useStateValue();
  return useMemo(() => datasets.filter((d) => ids.includes(d.resource.id)), [
    datasets,
    ids,
  ]);
}

export function usePortal() {
  const [{ portalID }] = useStateValue();
  return portalID;
}

export function useSetPortal(portalID) {
  const [, dispatch] = useStateValue();
  dispatch({
    type: 'SET_PORTAL',
    payload: portalID,
  });
}

export function useDatasetsDB({
  tags,
  term,
  categories,
  columns,
  depatments,
  domain,
  page,
  sortBy,
  ascending,
  perPage,
}) {
  const [results, setResults] = useState([]);
  const [{ portal }, , db] = useStateValue();
  window.db = db;
  const actualDomain = domain || portal.socrataDomain;
  useEffect(() => {
    console.log('SEARCH ', term);

    console.log('offset ', page * perPage, page);
    db.Datasets.where('tokens')
      .startsWithIgnoreCase(term)
      .offset(page * perPage)
      .limit(perPage)
      .toArray()
      .then((results) => setResults(results));
  }, [term, page, perPage, sortBy, db.Datasets]);

  return results;
}

export function useDatasets({ tags, term, categories, columns, departments }) {
  const [{ datasets }] = useStateValue();
  const results = useLunr({
    query: term,
    documents: datasets.map((d) => ({
      id: d.resource.id,
      name: d.resource.name,
      description: d.resource.description,
    })),
    options: {
      fields: ['name', 'description'],
    },
  });

  const searchedDatasets = results.map((r) =>
    datasets.find((d) => d.resource.id === r.ref),
  );

  return useMemo(() => {
    if (searchedDatasets) {
      let resultDatasets =
        searchedDatasets[0] && searchedDatasets[0].item
          ? searchedDatasets.map((match) => match.item)
          : [...searchedDatasets];

      const matches =
        searchedDatasets && searchedDatasets[0] && searchedDatasets[0].item
          ? searchedDatasets.map((d) => ({
              id: d.item.resource.id,
              matches: d.matches,
            }))
          : [];

      if (tags && tags.length > 0) {
        resultDatasets = resultDatasets.filter(
          (dataset) =>
            dataset.classification.domain_tags.filter((tag) =>
              tags.includes(tag),
            ).length > 0,
        );
      }

      if (categories && categories.length > 0) {
        resultDatasets = resultDatasets.filter(
          (dataset) =>
            dataset.classification.categories.filter((cat) =>
              categories.includes(cat),
            ).length > 0,
        );
      }

      if (columns && columns.length > 0) {
        resultDatasets = resultDatasets.filter(
          (dataset) =>
            dataset.resource.columns_name &&
            dataset.resource.columns_name.filter((col) => columns.includes(col))
              .length > 0,
        );
      }

      if (departments && departments.length > 0) {
        resultDatasets = resultDatasets.filter((dataset) =>
          departments.includes(
            dataset.classification.domain_metadata.find(
              (d) => d.key === 'Dataset-Information_Agency',
            )?.value,
          ),
        );
      }

      return {
        datasets: resultDatasets,
        matches: matches.filter((match) =>
          resultDatasets.find((r) => r.resource.id === match.id),
        ),
      };
    }
    return datasets;
  }, [searchedDatasets, tags, categories, columns, departments, datasets]);
}

export function useSortDatasetsBy(
  datasets,
  type,
  asc = false,
  searchTerm = '',
) {
  return useMemo(() => {
    // If we have a search term, do not sort the datasets
    if (searchTerm) {
      return datasets;
    }
    return datasets.sort((a, b) => {
      let valA = null;
      let valB = null;
      switch (type) {
        case 'Name':
          valA = a.resource.name;
          valB = b.resource.name;
          break;
        case 'Created At':
          valA = a.resource.createdAt;
          valB = b.resource.createdAt;
          break;
        case 'Updated At':
          valA = a.resource.updatedAt;
          valB = b.resource.updatedAt;
          break;
        case 'Downloads':
          valA = a.resource.download_count;
          valB = b.resource.download_count;
          break;
        case 'Views':
          valA = a.resource.page_views.page_views_total;
          valB = b.resource.page_views.page_views_total;
          break;
        default:
      }

      return (valA < valB ? 1 : -1) * (asc ? 1 : -1);
    });
  }, [searchTerm, datasets, type, asc]);
}

export function useUniqueColumnEntries(dataset, column) {
  const [uniqueEntries, setUniqueEntries] = useState(null);
  useEffect(() => {
    getUniqueEntries(dataset, column).then((res) => {
      setUniqueEntries({
        dataset: dataset.resource.id,
        column,
        distinct: res,
      });
    });
  }, [dataset, column]);
  return uniqueEntries;
}
