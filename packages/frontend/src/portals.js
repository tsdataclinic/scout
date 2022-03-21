import {
  faCity,
  faFlag,
  faSquare,
  faUniversity,
} from '@fortawesome/free-solid-svg-icons';
import PortalConfigs from './portal_configs.json';

export const Portals = PortalConfigs;

export const DEFAULT_PORTAL = 'NYC';
export const DEFAULT_PORTAL_ID = 'data.cityofnewyork.us';
export const GLOBAL_PORTAL_IDENTIFIER = 'all';

export const portalForDomain = domain =>
  Object.values(Portals).find(p => p.socrataDomain === domain);

export const iconForAdminLevel = adminLevel => {
  switch (adminLevel ? adminLevel.toLocaleLowerCase() : '') {
    case 'city':
      return faCity;
    case 'state':
      return faSquare;
    case 'county':
      return faFlag;
    case 'institution':
      return faUniversity;
    case 'insitution':
      return faUniversity;
    default:
      return null;
  }
};
