// number of packages to request at a time
const INTERVAL_SIZE = 100

const ckan = require('ckan');

// Pick a site to connect to:
// const client = new ckan.Client('https://demo.ckan.org/');
const client = new ckan.Client('https://data.humdata.org/');
// const client = new ckan.Client('http://ecaidata.org/');
// const client = new ckan.Client('https://data.gov.ie/');


client.requestType = 'GET';

function getAllPackages(pageLimit = null) {
    return new Promise((resolve, reject) => {
        const getPackagesForInterval = (offset, page, datasets) => {
            console.log('Requesting packages ', offset + 1, '-', offset + INTERVAL_SIZE)
            client.action(
                'current_package_list_with_resources',
                {"offset": offset, "limit": INTERVAL_SIZE},
                (err, res) => {
                    if (err) console.log(err);
                    if (err || !res.success || res.result.length === 0) {
                        resolve(datasets)
                    } else if (pageLimit && page >= pageLimit) {
                        resolve(datasets.concat(res.result))
                    } else {
                        console.log(res.result[0].name)
                        getPackagesForInterval(offset + INTERVAL_SIZE, page + 1, datasets.concat(res.result))
                    }
                }
            )

        }

        getPackagesForInterval(0, 1, []);
    });
}

function extractHumdataPackageMetadata(raw) {
    return {
        id: raw.id,
        name: raw.title, // there is also raw.name which seems to be a snake_case version of raw.name
        portal: raw.url,
        columns: null,
        columnFields: null,
        columnTypes: null,
        metaDataUpdatedAt: raw.metadata_modified,
        updatedAt: raw.last_modified,
        createdAt: raw.metadata_created,
        description: raw.notes,
        views: raw.pageviews_last_14_days,
        categories: null,
        domainCategory: null,
        tags: raw.tags, 
        // raw.tags = [{vocabulary_id, state, display_name, id, roads}]
        // might want to extract taw.tags.id instead
        type: raw.type,
        updateFrequency: raw.data_update_frequency,
        department: null,
        permaLink: null,
        parentDatasetID: null,
        updatedAutomation: null,
        owner: raw.owner_org,
    };
}



// returns a map of (field_name -> count) to get a sense of
// what kinds of fields are in the package metadata
function countPackageMetadataFieldFreq(packages) {
    let freq = {}
    packages.forEach(r => {
        Object.keys(r).forEach(prop => {
            // console.log(prop)
            if (!freq[prop]) {
                freq[prop] = 0
            }
            freq[prop] += 1
        })
    })
    return freq
}

function countResourceMetadataFieldFreq(packages) {
    let freq = {}
    packages.forEach(p => {
        p.resources.forEach(r => {
            console.log(p.name)
            Object.keys(r).forEach(prop => {
                if (!freq[prop]) {
                    freq[prop] = 0
                }
                freq[prop] += 1
            })
        })
    })
    return freq
}

// Extract resource fields
getAllPackages(1).then(packages => {
    fields = countPackageMetadataFieldFreq(packages)
    // fields = countPackageMetadataFieldFreq(packages)
    console.log(fields)
})