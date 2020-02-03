import { useMemo, useState, useEffect } from 'react';
import useFuse from 'react-use-fuse';
import { useStateValue } from '../contexts/OpenDataContext';
import { findJoinable, getUniqueEntries } from '../utils/socrata';

export function useStateLoaded() {
  const [{ stateLoaded }] = useStateValue();
  return stateLoaded;
}

export function useTags() {
  const [{ tagList }] = useStateValue();
  return tagList;
}

export function useCategories() {
  const [{ categories }] = useStateValue();
  return categories;
}

export function useDepartments() {
  const [{ departments }] = useStateValue();
  return departments;
}

export function useColumns() {
  const [{ columns }] = useStateValue();
  return columns;
}

export function useJoinableDatasets(dataset) {
  const [{ datasets }] = useStateValue();
  return useMemo(() => (dataset ? findJoinable(dataset, datasets) : []), [
    dataset,
    datasets,
  ]);
}

export function useGetSimilarDatasets(datasetID) {
  const [similarityMetrics, setSimilarityMetrics] = useState({});
  const [{ datasets }] = useStateValue();

  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/similarity_metrics.json`)
      .then((r) => r.json())
      .then((r) => setSimilarityMetrics(r));
  }, []);

  const similarDatasets = useMemo(
    () =>
      similarityMetrics[datasetID]
        ? similarityMetrics[datasetID].map((match) => ({
            ...match,
            dataset: datasets.find((d) => d.resource.id === match.dataset),
          }))
        : [],

    [similarityMetrics, datasetID, datasets],
  );
  return similarDatasets;
}

export function useDataset(datasetID) {
  const [{ datasets }] = useStateValue();
  return datasets.find((d) => d.resource.id === datasetID);
}

export function useGetDatasetsByIds(ids) {
  const [{ datasets }] = useStateValue();
  return useMemo(() => datasets.filter((d) => ids.includes(d.resource.id)), [
    datasets,
    ids,
  ]);
}

export function useDatasets({ tags, term, categories, columns, departments }) {
  const [{ datasets }] = useStateValue();

  const { result: searchedDatasets, search } = useFuse({
    data: datasets,
    options: {
      shouldSort: true,
      findAllMatches: true,
      keys: ['resource.name', 'resource.description'],
      caseSensitive: false,
    },
  });

  useEffect(() => {
    search(term);
  }, [search, term]);

  return useMemo(() => {
    if (searchedDatasets) {
      let resultDatasets = [...searchedDatasets];
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
      console.log('filtering with cols ', columns);
      if (columns && columns.length > 0) {
        console.log('filtering with columns ', columns);
        resultDatasets = resultDatasets.filter(
          (dataset) =>
            dataset.resource.columns_name &&
            dataset.resource.columns_name.filter((col) => columns.includes(col))
              .length > 0,
        );
      }

      if (departments && departments > 0) {
        resultDatasets = resultDatasets.filter((dataset) =>
          departments.includes(
            dataset.classification.domain_metadata.find(
              (d) => d.key === 'Dataset-Information_Agency',
            )?.value,
          ),
        );
      }

      return resultDatasets;
    }
    return datasets;
  }, [searchedDatasets, tags, categories, columns, departments, datasets]);
}

export function useSortDatsetsBy(datasets, type, asc = false) {
  console.log('here ', type, asc);
  return useMemo(() => {
    console.log('updating sort ');
    const result = datasets.sort((a, b) => {
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

        default:
      }
      return (valA < valB ? 1 : -1) * (asc ? 1 : -1);
    });
    if (result && result.length > 0) {
      console.log(result[0].resource.name);
    }
    return result;
  }, [datasets, type, asc]);
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
