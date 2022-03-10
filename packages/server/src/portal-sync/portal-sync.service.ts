import moment from 'moment';
import { Get, Injectable } from '@nestjs/common';
import { Cron, Timeout } from '@nestjs/schedule';
import fetch from 'node-fetch';
import { PortalService } from 'src/portals/portal.service';
import { DatasetService } from 'src/dataset/dataset.service';
import { ConfigService } from 'src/config/config.service';
import { DatasetColumnsService } from 'src/dataset-columns/dataset-columns.service';
import { TagsService } from 'src/tags/tags.service';
import { Portal } from '../portals/portal.entity';
import { Dataset } from '../dataset/dataset.entity';
import { DatasetColumn } from 'src/dataset-columns/dataset-column.entity';
import { Logger } from '@nestjs/common';
import * as fs from 'fs';
import { SearchService } from '../search/search.service';
import { PortalExternalInfo } from './portal-details-lookup';
import consoleLogObject from '../util/consoleLogObject';

// the portal details returned by Socrata API
type SocrataPortalDetails = {
  domain: string;

  // dataset count
  count: number;
};

// The dataset type returned by Socrata API
// An explanation of each key can be found here:
// https://socratadiscovery.docs.apiary.io/#reference/0/find-derived/base-assets
type SocrataDataset = {
  resource: {
    name: string;
    id: string;
    parent_fxf: string[];
    description: string;
    attribution: string;
    attribution_link: string;
    contact_email: string | null;
    type: string;
    updatedAt: string;
    createdAt: string;
    metadata_updated_at: string;
    data_updated_at: string | null;
    page_views: {
      page_views_last_week: number;
      page_views_last_month: number;
      page_views_total: number;
      page_views_last_week_log: number;
      page_views_last_month_log: number;
      page_views_total_log: number;
    };
    columns_name: string[];
    columns_field_name: string[];
    columns_datatype: string[];
    columns_description: string[];
    columns_format: Array<{
      noCommas: string;
      align: string;
      percentScale: string;
      precisionStyle: string;
      view: string;
    }>;
    download_count: number;
    provenance: string;
    lens_view_type: string;
    lens_display_type: string;
    blob_mime_type: string;
    hide_from_data_json: boolean;
    publication_date: string;
  };
  classification?: {
    // An array of categories that have been algorithmically assigned
    categories: string[];

    // An array of tags that have been algorithmically assigned
    tags: unknown[];

    // The singular category given to the asset by the owning domain
    domain_category: string;

    // An array of tags given to the asset by the owning domain
    domain_tags: string[];
    domain_metadata: Array<{
      key: string;
      value: string;
    }>;
  };
  metadata: { domain: string };
  permalink: string;
  link: string;
  owner: {
    id: string;
    user_type: string;
    display_name: string;
  };
  creator: {
    id: string;
    user_type: string;
    display_admin: string;
  };
};

/**
 * This is only necessary if UPDATE_ON_BOOT is set to true.
 * All configs here should be `false`. Selectively change things to `true` to
 * suit your testing needs.
 */
const DATA_REFRESH_CONFIG = {
  // set this to true to ignore populating elastic search
  skipElasticSearchRebuild: false,
  skipPostgresRefresh: false,
  skipMLDatasetProcessing: false,

  // set this to true to use a hardcoded list of portals
  usePortalListOverride: true,

  // if `usePortalListOverride` is true, then use this list of portals instead
  // of pulling all portals from Socrata
  portalList: [
    'data.cityofchicago.org',
    /*
    'data.cityofnewyork.us',
    'data.ny.gov',
    'data.nashville.gov',
    */
  ],
};

@Injectable()
export class PortalSyncService {
  constructor(
    private readonly portalService: PortalService,
    private readonly datasetService: DatasetService,
    private readonly datasetColumnsService: DatasetColumnsService,
    private readonly tagsService: TagsService,
    private readonly searchService: SearchService,
    private readonly configService: ConfigService,
  ) {}

  @Timeout(0)
  async onceAtStartup() {
    if (this.configService.get('UPDATE_ON_BOOT')) {
      if (!DATA_REFRESH_CONFIG.skipPostgresRefresh) {
        await this.refreshPortalList();
      }

      if (!DATA_REFRESH_CONFIG.skipElasticSearchRebuild) {
        await this.searchService.createIndex({ recreate: true });
        await this.searchService.populateIndex({
          skipMLDatasetProcessing: DATA_REFRESH_CONFIG.skipMLDatasetProcessing,
          portalIds: DATA_REFRESH_CONFIG.usePortalListOverride
            ? DATA_REFRESH_CONFIG.portalList
            : undefined,
        });
      } else {
        console.log('Skipping elasticsearch update');
      }

      console.log('Done updating all data');
    }
  }

  async readSimilarityFile(filePath: string) {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          throw err;
        }
        resolve(JSON.parse(data));
      });
    });
  }

  /**
   * Map values from a SocrataDataset API result to a Dataset type that we
   * ingest into our db
   */
  mapSocrataDataset(datasetData: SocrataDataset, portal: Portal): Dataset {
    const dataset = new Dataset();
    const { resource, classification, permalink } = datasetData;

    // Process domain_metadata to try and get more helpful information
    // This can be an imperfect process because each portal defines their
    // metadata keys a bit differently.
    const domain_metadata = classification?.domain_metadata || [];

    // get category
    const { domain_category: domainCategory, categories } = classification;

    // remove all categories that are equal to the domainCategory (which is the
    // definitive category, it's defined by the dataset owner)
    const extraCategories = categories.filter(
      cat => cat.toLowerCase() !== domainCategory.toLowerCase(),
    );
    const allCategories = [domainCategory].concat(extraCategories);

    // get update frequency
    const updateFrequency = domain_metadata.find(({ key }) =>
      key.toLowerCase().includes('frequency'),
    )?.value;

    // get agency
    let department = domain_metadata.find(({ key }) =>
      key.toLowerCase().includes('agency'),
    )?.value;

    // sometimes the department might be listed as a data owner instead
    if (department === undefined) {
      department = domain_metadata.find(({ key }) =>
        key.toLowerCase().includes('owner'),
      )?.value;
    }

    dataset.id = resource.id;
    dataset.name = resource.name;
    dataset.metadataUpdatedAt = new Date(resource.metadata_updated_at);
    dataset.updatedAt = new Date(resource.data_updated_at);
    dataset.createdAt = new Date(resource.createdAt);
    dataset.description = resource.description;
    dataset.views = resource.page_views.page_views_total;
    dataset.type = resource.type;
    dataset.updateFrequency = updateFrequency;
    dataset.department = department;
    dataset.permalink = permalink;
    dataset.portal = Promise.resolve(portal);
    dataset.categories = allCategories;
    return dataset;
  }

  async getPageOfDatasets(
    portal: Portal,
    page: number,
    perPage: number,
  ): Promise<SocrataDataset[]> {
    const url = `https://api.us.socrata.com/api/catalog/v1?domains=${
      portal.id
    }&search_context=${portal.id}&limit=${perPage}&offset=${perPage * page}`;

    try {
      const pageRequest = await fetch(url);
      const pageResult: { results: undefined | SocrataDataset[] } =
        await pageRequest.json();
      return pageResult.results ?? [];
    } catch {
      console.log('Issue with metadata query');
    }
  }

  async makeColumnsForDataset(
    datasetDetails: SocrataDataset,
    dataset: Dataset,
    portal: Portal,
  ): Promise<(DatasetColumn | void)[]> {
    const column_fields = datasetDetails.resource.columns_field_name;
    const column_types = datasetDetails.resource.columns_datatype;
    const columns: Promise<DatasetColumn[]> = Promise.all(
      datasetDetails.resource.columns_name.map(async (name, index) => {
        const datasetColumn = new DatasetColumn();
        datasetColumn.name = name;
        datasetColumn.field = column_fields[index];
        datasetColumn.type = column_types[index];
        datasetColumn.dataset = Promise.resolve(dataset);
        datasetColumn.portal = Promise.resolve(portal);
        // datasetColumn.id = dataset.id + '_' + column_fields[index];
        const savedColumn = await this.datasetColumnsService.createOrUpdate(
          datasetColumn,
        );
        return savedColumn;
      }),
    ).then(cols => cols.filter((d): d is DatasetColumn => d !== undefined));

    return columns;
  }

  async refreshDatasetsForPortal(portal: Portal): Promise<void> {
    console.log(`Beginning dataset refresh for ${portal.id}`);
    const perPage = 100;
    const pages = Math.ceil(portal.datasetCount / perPage);
    const allDatasets = await Promise.all(
      [...Array(pages)].map((_, page: number) =>
        this.getPageOfDatasets(portal, page, perPage),
      ),
    );

    const flattenedDatasets: SocrataDataset[] = [];
    allDatasets.forEach(datasets => {
      flattenedDatasets.push(...datasets);
    });

    await Promise.all(
      flattenedDatasets.map(async (datasetDetails: SocrataDataset) => {
        // const tags = await this.makeTagsForDataset(datasetDetails);
        try {
          const dataset = this.mapSocrataDataset(datasetDetails, portal);
          const savedDataset = await this.datasetService.createOrUpdate(
            dataset,
          );
          await this.makeColumnsForDataset(
            datasetDetails,
            savedDataset,
            portal,
          );
          return savedDataset;
        } catch {
          Logger.warn(
            `Got duplicate id ${datasetDetails.resource.id} on portal ${portal.name}`,
          );
          return undefined;
        }
      }),
    );

    console.log('Completed dataset refresh for', portal.id);
  }

  async createAndUpdatePortal(portalDetails: SocrataPortalDetails) {
    const portal = new Portal();
    const externalDetails = PortalExternalInfo[portalDetails.domain];
    console.log('Processing portal: ', externalDetails, portalDetails.domain);

    // set the details for this portal
    portal.name = externalDetails ? externalDetails.name : portalDetails.domain;
    portal.id = portalDetails.domain;
    portal.datasetCount = portalDetails.count;
    portal.baseURL = portalDetails.domain;
    portal.abbreviation = externalDetails
      ? externalDetails.abbreviation
      : portalDetails.domain.replace(/./g, '_');
    portal.adminLevel = externalDetails
      ? externalDetails.adminLevel
      : 'unknown';
    portal.logo = externalDetails ? externalDetails.logo : null;

    const savedPortal = await this.portalService.createOrUpdatePortal(portal);
    console.log('Finished saving portal', portalDetails.domain);

    await this.refreshDatasetsForPortal(savedPortal);
  }

  async refreshPortalList() {
    console.log('BEGINNING IMPORT INTO DATABASE');
    const portalListRequest = await fetch(
      'http://api.us.socrata.com/api/catalog/v1/domains',
    );
    const portalListRemote: {
      results: SocrataPortalDetails[];
    } = await portalListRequest.json();

    // Overwrite the portal list with the ones specified
    const validPortals = DATA_REFRESH_CONFIG.usePortalListOverride
      ? new Set(DATA_REFRESH_CONFIG.portalList)
      : new Set(Object.keys(PortalExternalInfo));
    const portalList = portalListRemote.results.filter(portal =>
      validPortals.has(portal.domain),
    );

    // Process all portals sequentially
    // TODO: can this be safely done in parallel?
    await portalList.reduce(
      async (
        prevPromise: Promise<void>,
        portalDetails: SocrataPortalDetails,
      ): Promise<void> => {
        await prevPromise;
        return this.createAndUpdatePortal(portalDetails);
      },
      Promise.resolve(),
    );

    console.log('IMPORT COMPLETE: All data portals have been updated');
  }
}
