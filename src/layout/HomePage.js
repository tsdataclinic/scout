import React, {useState} from 'react';
import {useCategories, useTags, useDatasets} from '../hooks/datasets';
import {findJoinable} from '../utils/socrata';
import CategorySelector from '../components/CategorySelector';
import Dataset from '../components/Dataset';
import usePagination from '../hooks/pagination';

export default function HomePage({}) {
  const categories = useCategories();
  const tags = useTags();
  const [tag, setTag] = useState(['buildings']);
  const [searchTerm, setSearchTerm] = useState('');
  const datasets = useDatasets({tags: tag, term: searchTerm});
  const [pagedDatasets, {pageButtons}] = usePagination(datasets);

  const clearTag = () => {
    console.log('Clearning tab');
    setTag([]);
  };

  return (
    <div className="HomePage">
      <h1>Home Page</h1>
      <h2>Categories</h2>
      <CategorySelector categories={categories} />
      <h2>
        Tags: {tag} <span onClick={clearTag}>X</span>
      </h2>
      {tags && (
        <ul className="tag-list">
          {tags.map(tag => (
            <li onClick={() => setTag([tag])} key={tag}>
              {tag}
            </li>
          ))}
        </ul>
      )}
      <h2>Datasets</h2>
      {pageButtons}
      <input
        type="text"
        onChange={e => setSearchTerm(e.target.value)}
        value={searchTerm}
        placeholder="search"
      />
      <ul style={{height: '300px', overflowY: 'auto'}}>
        {pagedDatasets.map(dataset => (
          <li>
            <Dataset dataset={dataset} />
            <h2>Potential Matches</h2>
            <ul>
              {findJoinable(dataset, datasets).map(match => (
                <li>
                  <span style={{fontWeight: 'bold'}}>
                    {' '}
                    {match.dataset.resource.name}
                  </span>{' '}
                  | shares {match.joinableColumns.join(', ')}{' '}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
