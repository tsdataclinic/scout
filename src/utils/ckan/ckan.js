const ckan = require('ckan');

const client = new ckan.Client('https://data.humdata.org/');
client.requestType = 'GET';

async function getPortalMetadata() {
  return new Promise((resolve) => {
    client.action('package_list', {}, (err, res) => {
      if (err) console.log(err);
      const packages = res.result;
      resolve(packages);
    });
  });
}

function getDatasetMetadata(datasetId) {
  return new Promise((resolve) => {
    const getMD = (dsID) => {
      client.action(
        'package_show',
        {
          id: dsID,
        },
        (err, out) => {
          // if (err) console.log (err);
          if (out && out.result) {
            resolve(out.result);
          } else {
            console.log(err);
            resolve({});
          }
        },
      );
    };
    getMD(datasetId);
  });
}

function extractMetadata(raw) {
  return {
    id: raw.id,
    name: raw.title,
    portal: raw.url,
    columns: null, // no corresponding field
    columnFields: null,
    columnTypes: null,
    metaDataUpdatedAt: raw.metadata_modified,
    updatedAt: raw.last_modified,
    createdAt: raw.dataset_date, // OR raw.metadata_created
    description: raw.notes,
    views: raw.pageviews_last_14_days,
    categories: null,
    domainCategory: null,
    tags: raw.tags,
    type: raw.type,
    updateFrequency: raw.data_update_frequency,
    department: null,
    permaLink: null,
    parentDatasetID: null,
    updatedAutomation: null,
    owner: raw.package_creator,
  };
}

// TODO: rate limit requests
getPortalMetadata().then((datasets) => {
  Promise.all(datasets.map((d) => getDatasetMetadata(d))).then((results) => {
    const extracted = results.map(extractMetadata);
    console.log(extracted);
  });
});
