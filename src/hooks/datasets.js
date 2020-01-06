import {useMemo} from 'react';
import {useStateValue} from '../contexts/OpenDataContext';

export function useTags() {
  const [{tagList}] = useStateValue();
  return tagList;
}

export function useCategories() {
  const [{categories}] = useStateValue();
  return categories;
}

export function useDatasets({tags, term}) {
  let [{datasets}] = useStateValue();
  return useMemo(() => {
    if (tags) {
      datasets = datasets.filter(dataset =>
        dataset.classification.domain_tags.includes(tags[0]),
      );
    }

    if (term) {
      datasets = datasets.filter(dataset =>
        dataset.resource.name.toLowerCase().includes(term.toLowerCase()),
      );
    }

    console.log('return size ', datasets.length);
    return datasets;
  }, [tags, term, datasets]);
}
