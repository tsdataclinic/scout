import {
  db,
  loadCategoriesIntoDB,
  loadColumnsIntoDB,
  loadDatasetsIntoDB,
  loadTagsIntoDB,
  loadDepartmentsIntoDB,
} from '../database';

import {
  getCategories,
  getColumns,
  getTagList,
  getDepartments,
} from '../utils/socrata';

self.addEventListener('message', work);

function work(event) {
  const { manifest, portal } = event.data;

  const tagList = getTagList(manifest);
  const categories = getCategories(manifest);
  const departments = getDepartments(manifest);
  const columns = getColumns(manifest);
  loadDatasetsIntoDB(manifest, portal.socrataDomain);
  this.postMessage('database_updated');
  loadTagsIntoDB(tagList, portal.socrataDomain);
  this.postMessage('database_updated');
  loadDepartmentsIntoDB(departments, portal.socrataDomain);
  this.postMessage('database_updated');
  loadCategoriesIntoDB(categories, portal.socrataDomain);
  this.postMessage('database_updated');
  loadColumnsIntoDB(columns, portal.socrataDomain);
  this.postMessage('all_loaded');
}
