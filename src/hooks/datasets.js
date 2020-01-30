import { useMemo, useState, useEffect } from 'react';
import useFuse from 'react-use-fuse';
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

export function useGetDatasetsByIds(ids) {
  const [{ datasets }] = useStateValue();
  return useMemo(() => datasets.filter((d) => ids.includes(d.resource.id)), [
    datasets,
    ids,
  ]);
}

export function useDatasets({ tags, term, categories, departments }) {
  const [{ datasets }] = useStateValue();

  const { searchedDatasets, search } = useFuse({
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
    console.log('searched datasets ', searchedDatasets, datasets);
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
  }, [searchedDatasets, tags, categories, departments, datasets]);
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
