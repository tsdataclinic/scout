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
    let filteredDatasets = [...datasets];
    console.log(
      'Filtering ',
      filteredDatasets.length,
      ' with tags ',
      tags,
      ' and search term ',
      term,
    );
    if (tags && tags.length > 0) {
      console.log('applting');
      filteredDatasets = filteredDatasets.filter(dataset =>
        dataset.classification.domain_tags.includes(tags[0]),
      );
    }

    console.log('after tags ', filteredDatasets.length);

    if (term && term.length > 0) {
      filteredDatasets = filteredDatasets.filter(dataset =>
        dataset.resource.name.toLowerCase().includes(term.toLowerCase()),
      );
    }

    console.log('after term ', filteredDatasets.length);
    console.log('return size ', filteredDatasets.length);
    return filteredDatasets;
  }, [tags, term, datasets]);
}
