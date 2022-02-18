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
import { Tag } from '../tags/tags.entity';
import * as fs from 'fs';
import { SearchService } from '../search/search.service';
import { PortalExternalInfo } from './portal-details-lookup';

const OVERRIDE_PORTAL_LIST = false;
const OVERRIDE_LIST = [
  'data.cityofnewyork.us',
  'data.ny.gov',
  'data.cityofchicago.org',
  'data.nashville.gov',
];

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
      await this.refreshPortalList();
      await this.searchService.createIndex(true);
      await this.searchService.populateIndex();

      // await this.searchService.findSimilar('test datasets');
      console.log('Done all');
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

  mapSocrataDataset(datasetData: any, portal: Portal): Dataset {
    let dataset = new Dataset();
    const { resource, metadata, classification, permalink } = datasetData;
    const domain_metadata = classification
      ? classification.domain_metadata
      : null;

    const updatedAutomation = domain_metadata?.find(
      ({ key, value }) => key === 'Update_Automation' && value === 'No',
    )?.value;

    const updateFrequency = domain_metadata?.find(
      ({ key }) => key === 'Update_Update-Frequency',
    )?.value;

    const department = domain_metadata?.find(
      ({ key }) => key === 'Dataset-Information_Agency',
    )?.value;

    dataset.id = resource.id;
    dataset.name = resource.name;
    dataset.metadataUpdatedAt = resource.metadata_updated_at;
    dataset.updatedAt = resource.data_updated_at;
    dataset.createdAt = resource.createdAt;
    dataset.description = resource.description;
    dataset.views = resource.page_views.page_views_total;
    dataset.type = resource.type;
    dataset.updateFrequency = updateFrequency;
    dataset.department = department;
    dataset.permalink = permalink;
    dataset.updatedAutomation = updatedAutomation;
    dataset.portal = Promise.resolve(portal);
    return dataset;
  }

  async getPageOfDatasets(portal: Portal, page: number, perPage: number) {
    const url = `https://api.us.socrata.com/api/catalog/v1?domains=${
      portal.id
    }&search_context=${portal.id}&limit=${perPage}&offset=${perPage * page}`;

    try {
      const pageRequest = await fetch(url);
      const pageResult = await pageRequest.json();
      return pageResult.results;
    } catch {
      console.log('issue with metadata query');
    }
  }

  async makeColumnsForDataset(
    datasetDetails,
    dataset: Dataset,
    portal: Portal,
  ): Promise<DatasetColumn[]> {
    const column_fields = datasetDetails.resource.columns_field_name;
    const column_types = datasetDetails.resource.columns_datatype;
    const columns: Promise<DatasetColumn[]> = Promise.all(
      datasetDetails.resource.columns_name.map(async (name, index) => {
        let datasetColumn = new DatasetColumn();
        datasetColumn.name = name;
        datasetColumn.field = column_fields[index];
        datasetColumn.type = column_types[index];
        datasetColumn.dataset = Promise.resolve(dataset);
        datasetColumn.portal = Promise.resolve(portal);
        //        datasetColumn.id = dataset.id + '_' + column_fields[index];
        const savedColumn = await this.datasetColumnsService.createOrUpdate(
          datasetColumn,
        );
        return savedColumn;
      }),
    );
    return columns;
  }

  async refreshDatasetsForPortal(portal: Portal) {
    console.log('Beginning dataset refresh');
    const perPage = 100;
    const pages = Math.ceil(portal.datasetCount / perPage);
    const allDatasets = await Promise.all(
      [...Array(pages)].map((a, page) =>
        this.getPageOfDatasets(portal, page, perPage),
      ),
    );

    const flattenedDatasets = allDatasets.reduce(
      (flatArray, datasets) => [...flatArray, ...(datasets ? datasets : [])],
      [],
    );

    await Promise.all(
      flattenedDatasets.map(async datasetDetails => {
        // const tags = await this.makeTagsForDataset(datasetDetails);
        try {
          let dataset = this.mapSocrataDataset(datasetDetails, portal);
          const savedDataset = await this.datasetService.createOrUpdate(
            dataset,
          );
          const columns = await this.makeColumnsForDataset(
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

    console.log('Completed dataset refresh');
  }

  async createAndUpdatePortal(portalDetails) {
    let portal = new Portal();
    const externalDetails = PortalExternalInfo[portalDetails.domain];
    console.log('External ', externalDetails, portalDetails.domain);

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

    portal = await this.portalService.createOrUpdatePortal(portal);
    console.log('Finished saving portal');

    await this.refreshDatasetsForPortal(portal);
    console.log('created ', portal.name);
  }

  async refreshPortalList() {
    const portalListRequest = await fetch(
      'http://api.us.socrata.com/api/catalog/v1/domains',
    );
    const portalListRemote = await portalListRequest.json();

    // Overwrite the portal list with the ones specified
    const portalList = OVERRIDE_PORTAL_LIST
      ? portalListRemote.results.filter(p => OVERRIDE_LIST.includes(p.domain))
      : portalListRemote.results.filter(p =>
          Object.keys(PortalExternalInfo).includes(p.domain),
        );

    const starterPromise = Promise.resolve(null);
    await portalList
      // .slice(0, 5)
      .reduce(
        (p, portalDetails) =>
          p.then(() => this.createAndUpdatePortal(portalDetails)),
        starterPromise,
      );
    console.log('import done ');
  }
}
