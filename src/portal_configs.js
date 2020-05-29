export const PortalConfigs = {
  NYC: {
    prefix: 'nyc',
    name: 'New York City',
    logo:
      'https://opendata.cityofnewyork.us/wp-content/themes/opendata-wp/assets/img/nyc-open-data-logo.svg',
    socrataDomain: 'data.cityofnewyork.us',
    storageID: 1,
  },
  NYS: {
    prefix: 'ny_state',
    name: 'New York State',
    logo:
      'https://static-assets.ny.gov/sites/all/themes/ny_gov/images/nygov-logo.png',
    socrataDomain: 'data.ny.gov',
    storageID: 2,
  },
  CHI: {
    prefix: 'chicago',
    name: 'Chicago',
    logo:
      'https://data.cityofchicago.org/api/assets/73F1665C-0FE6-4183-8AD1-E91DB8EFAFA4?7CB02402-8E06-48B0-8C9A-3890182D58C7.png',
    socrataDomain: 'data.cityofchicago.org',
    storageID: 3,
  },
};

export const DEFAULT_PORTAL = 'CHI';
