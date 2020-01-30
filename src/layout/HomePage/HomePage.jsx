import React, { useState } from 'react';
import './HomePage.scss';
import {
  useCategories,
  useTags,
  useDepartments,
  useDatasets,
  useStateLoaded,
} from '../../hooks/datasets';
import useCollection from '../../hooks/collections';
import Dataset from '../../components/Dataset/Dataset';
import DatasetLoading from '../../components/Loading/DatasetLoading/DatasetLoading';
import usePagination from '../../hooks/pagination';
import MultiSelector from '../../components/MultiSelector/MultiSelector';

export default function HomePage() {
  const categories = useCategories();
  const tags = useTags();
  const departments = useDepartments();
  const loaded = useStateLoaded();
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [
    collection,
    { addToCollection, removeFromCollection },
  ] = useCollection();

  const datasets = useDatasets({
    tags: selectedTags,
    categories: selectedCategories,
    term: searchTerm,
    departments: selectedDepartments,
  });
  const [pagedDatasets, { pageButtons }] = usePagination(datasets, 5);

  return (
    <div className="home-page">
      <div className="filters">
        <div className="categories">
          <MultiSelector
            items={categories}
            onChange={setSelectedCategories}
            selected={selectedCategories}
            title="Categories"
          />
        </div>
        <div className="departments">
          <MultiSelector
            items={departments}
            selected={selectedDepartments}
            onChange={setSelectedDepartments}
            title="Departments"
          />
        </div>
        <div className="tags">
          <MultiSelector
            items={tags}
            selected={selectedTags}
            onChange={setSelectedTags}
            title="Tags"
          />
        </div>
      </div>
      <div className="datasets">
        <div className="search">
          <input
            type="text"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
            placeholder="Search for dataset"
          />
        </div>
        <div className="count-and-sort">
          <p>
            <span className="bold">{datasets.length}</span> datasets
          </p>
          <p>
            Sort by: <span className="bold">Recently updated</span>
          </p>
        </div>

        <ul className="dataset-list">
          {loaded ? (
            pagedDatasets.map((dataset) => (
              <Dataset
                key={dataset?.resource?.id}
                dataset={dataset}
                inCollection={collection.datasets.includes(dataset.resource.id)}
                onAddToCollection={addToCollection}
                onRemoveFromCollection={removeFromCollection}
              />
            ))
          ) : (
            <DatasetLoading />
          )}
        </ul>
        <div>{pageButtons}</div>
      </div>
    </div>
  );
}
