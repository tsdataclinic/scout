import { useMemo, useState, useEffect } from 'react';
import { useStateValue } from '../contexts/OpenDataContext';
import { findJoinable, getUniqueEntries } from '../utils/socrata';

export function useTags() {
  const [{ tagList }] = useStateValue();
  return tagList;
}

export function useCategories() {
  const [{ categories }] = useStateValue();
  return categories;
}

export function useJoinableDatasets(dataset) {
  const [{ datasets }] = useStateValue();
  return useMemo(() => (dataset ? findJoinable(dataset, datasets) : []), [
    dataset,
    datasets,
  ]);
}

export function useDataset(datasetID) {
  const [{ datasets }] = useStateValue();
  return datasets.find((d) => d.resource.id === datasetID);
}

export function useDatasets({ tags, term, categories, ids }) {
  const [{ datasets }] = useStateValue();

  return useMemo(() => {
    let filteredDatasets = [...datasets];

    if (ids) {
      return filteredDatasets.filter((d) => ids.includes(d.resource.id));
    }

    if (tags && tags.length > 0) {
      filteredDatasets = filteredDatasets.filter(
        (dataset) =>
          dataset.classification.domain_tags.filter((tag) => tags.includes(tag))
            .length > 0,
      );
    }

    if (categories && categories.length > 0) {
      filteredDatasets = filteredDatasets.filter(
        (dataset) =>
          dataset.classification.categories.filter((cat) =>
            categories.includes(cat),
          ).length > 0,
      );
    }

    if (term && term.length > 0) {
      filteredDatasets = filteredDatasets.filter((dataset) =>
        dataset.resource.name.toLowerCase().includes(term.toLowerCase()),
      );
    }

    return filteredDatasets;
  }, [datasets, ids, tags, categories, term]);
}

export function useJoinColumnUniqueCount(joins) {
  const [uniqueCounts, setUniqueCounts] = useState([]);
  useEffect(() => {
    let promises = [];
    joins.forEach((j) => {
      j.joinableColumns.forEach((col) => {
        promises.push(
          getUniqueEntries(j.dataset, col).then((res) => ({
            dataset: j.dataset.resource.id,
            col,
            distinct: res,
          })),
        );
      });
    });
    // This ensures that we resolve even if one of our fetch requests fail
    promises = promises.map((p) => p.catch(() => undefined));
    Promise.all(promises).then((result) => setUniqueCounts(result));
  }, [joins]);
  return uniqueCounts;
}
