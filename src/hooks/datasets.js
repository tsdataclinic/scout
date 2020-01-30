import { useMemo, useState, useEffect } from 'react';
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

export function useDatasets({ tags, term, categories, departments, ids }) {
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

    if (departments && departments > 0) {
      filteredDatasets = filteredDatasets.filter((dataset) =>
        departments.includes(
          dataset.classification.domain_metadata.find(
            (d) => d.key === 'Dataset-Information_Agency',
          )?.value,
        ),
      );
    }
    if (term && term.length > 0) {
      filteredDatasets = filteredDatasets.filter((dataset) =>
        dataset.resource.name.toLowerCase().includes(term.toLowerCase()),
      );
    }

    return filteredDatasets;
  }, [datasets, ids, tags, categories, departments, term]);
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
