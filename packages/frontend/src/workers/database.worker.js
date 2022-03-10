import {
  loadCategoriesIntoDB,
  loadColumnsIntoDB,
  loadDatasetsIntoDB,
  loadTagsIntoDB,
  loadDepartmentsIntoDB,
} from '../database';

/*
import {
  getCategories,
  getColumns,
  getTagList,
  getDepartments,
} from '../utils/socrata';
*/

// eslint-disable-next-line
self.addEventListener('message', work);

export default function work(event) {
  const { manifest, portal } = event.data;

  /*
  const tagList = getTagList(manifest);
  const categories = getCategories(manifest);
  const departments = getDepartments(manifest);
  const columns = getColumns(manifest);
  */
  const tagList = {};
  const categories = [];
  const departments = [];
  const columns = [];

  loadDatasetsIntoDB(manifest.slice(0, 100), portal.socrataDomain).then(() => {
    this.postMessage({
      event: 'database_updated',
      table: 'datasets',
    });
    loadDatasetsIntoDB(manifest.slice(100), portal.socrataDomain).then(() => {
      this.postMessage({
        event: 'database_updated',
        table: 'datasets',
      });

      setTimeout(() => {
        loadTagsIntoDB(tagList, portal.socrataDomain).then(() => {
          this.postMessage({ event: 'database_updated', table: 'tags' });
          loadDepartmentsIntoDB(departments, portal.socrataDomain).then(() => {
            this.postMessage({
              event: 'database_updated',
              table: 'departments',
            });
            loadCategoriesIntoDB(categories, portal.socrataDomain).then(() => {
              this.postMessage({
                event: 'database_updated',
                table: 'categories',
              });
              loadColumnsIntoDB(columns, portal.socrataDomain).then(() => {
                this.postMessage({
                  event: 'database_updated',
                  table: 'columns',
                });
                this.postMessage({ event: 'all_loaded' });
              });
            });
          });
        });
      }, 1000);
    });
  });
}
