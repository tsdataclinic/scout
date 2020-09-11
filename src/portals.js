import { faCity, faSquare } from '@fortawesome/free-solid-svg-icons';
import { default as PortalConfigs } from './portal_configs.json';

export const Portals = PortalConfigs;

export const DEFAULT_PORTAL = 'CHI';

export const portalForDomain = (domain) => {
  return Object.values(Portals).find((p) => p.socrataDomain === domain);
};

export const iconForAdminLevel = (adminLevel) => {
  switch (adminLevel) {
    case 'city':
      return faCity;
    case 'state':
      return faSquare;
    default:
      return null;
  }
};
