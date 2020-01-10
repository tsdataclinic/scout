import {useMemo} from 'react';
import {useStateValue} from '../contexts/OpenDataContext';
import {findJoinable} from '../utils/socrata';

export function useTags() {
  const [{tagList}] = useStateValue();
  return tagList;
}

export function useCategories() {
  const [{categories}] = useStateValue();
  return categories;
}

export function useJoinableDatasets(dataset) {
  const [{datasets}] = useStateValue();
  console.log(dataset);
  return useMemo(() => (dataset ? findJoinable(dataset, datasets) : []), [
    dataset,
    datasets,
  ]);
}

export function useDataset(datasetID) {
  let [{datasets}] = useStateValue();
  return datasets.find(d => d.resource.id === datasetID);
}

export function useDatasets({tags, term, categories}) {
  let [{datasets}] = useStateValue();
  return useMemo(() => {
    let filteredDatasets = [...datasets];

    if (tags && tags.length > 0) {
      console.log('applting');
      filteredDatasets = filteredDatasets.filter(
        dataset =>
          dataset.classification.domain_tags.filter(tag => tags.includes(tag))
            .length > 0,
      );
    }

    if (categories && categories.length > 0) {
      filteredDatasets = filteredDatasets.filter(
        dataset =>
          dataset.classification.categories.filter(cat =>
            categories.includes(cat),
          ).length > 0,
      );
    }

    if (term && term.length > 0) {
      filteredDatasets = filteredDatasets.filter(dataset =>
        dataset.resource.name.toLowerCase().includes(term.toLowerCase()),
      );
    }

    console.log('after term ', filteredDatasets.length);
    console.log('return size ', filteredDatasets.length);
    return filteredDatasets;
  }, [tags, term, categories, datasets]);
}
