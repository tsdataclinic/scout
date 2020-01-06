import React, {useState} from 'react';
import {useCategories, useTags, useDatasets} from '../hooks/datasets';

export default function HomePage({}) {
  const categories = useCategories();
  const tags = useTags();
  const [tag, setTag] = useState('buildings');
  const [searchTerm, setSearchTerm] = useState('');
  const datasets = useDatasets({tags: [tag], term: searchTerm});
  console.log('outside dataset size ', datasets.length);
  console.log('filtered datasets are ', datasets);
  return (
    <div className="HomePage">
      <h1>Home Page</h1>
      <h2>Tags: {tag}</h2>
      {tags && (
        <ul className="tag-list">
          {tags.map(tag => (
            <li onClick={() => setTag(tag)} key={tag}>
              {tag}
            </li>
          ))}
        </ul>
      )}
      <h2>Datasets</h2>
      <input
        type="text"
        onChange={e => setSearchTerm(e.target.value)}
        value={searchTerm}
        placeholder="search"
      />
      {datasets && (
        <ul style={{height: '300px', overflowY: 'auto'}}>
          {datasets.map((dataset, index) => (
            <li key={index}>
              <h4>
                <a target="_blank" href={dataset.permalink}>
                  {dataset.resource.name}
                </a>
              </h4>
              <p>{dataset.resource.description}</p>
              <p>{dataset.classification.domain_tags.join(', ')}</p>
            </li>
          ))}
        </ul>
      )}
      <h2>Categories</h2>
      {categories && (
        <ul>
          {categories.map(category => (
            <li key={category}>{category}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
