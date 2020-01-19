import React, { useState } from 'react';
import './HomePage.scss';
import { useCategories, useTags, useDatasets } from '../../hooks/datasets';
import CategorySelector from '../../components/CategorySelector/CategorySelector';
import Dataset from '../../components/Dataset/Dataset';
import usePagination from '../../hooks/pagination';
import TagSelector from '../../components/TagSelector/TagSelector';

export default function HomePage() {
  const categories = useCategories();
  const tags = useTags();
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const datasets = useDatasets({
    tags: selectedTags,
    categories: selectedCategories,
    term: searchTerm,
  });
  const [pagedDatasets, { pageButtons }] = usePagination(datasets);

  return (
    <div className="home-page">
      <div className="categories">
        <CategorySelector
          categories={categories}
          onChange={setSelectedCategories}
          selected={selectedCategories}
        />
      </div>

      <div className="tags">
        <TagSelector
          tags={tags}
          selected={selectedTags}
          onChange={setSelectedTags}
        />
      </div>
      <div className="datasets">
        <h2>
          Datasets ({pagedDatasets.length} / {datasets.length} )
        </h2>
        <div className="search">
          <input
            type="text"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
            placeholder="search"
          />
        </div>
        <ul className="dataset-list">
          {pagedDatasets.map((dataset) => (
            <Dataset dataset={dataset} />
          ))}
        </ul>
        <div>{pageButtons}</div>
      </div>
    </div>
  );
}
