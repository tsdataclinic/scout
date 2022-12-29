import { Injectable } from '@nestjs/common';
import {
  Dataset,
  PagedDatasets,
  PagedCategoryCount,
  PagedDepartmentCount,
  CategoryCount,
} from './dataset.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository, In } from 'typeorm';
import { Portal } from '../portals/portal.entity';
import { SearchService } from '../search/search.service';
import { DatasetColumn } from '../dataset-columns/dataset-column.entity';

export type DatasetForElasticSearch = {
  id: string;
  name: string;
  description: string;
  portalId: string;
  department: string;
  categories: string[];
  datasetColumnFields: string[];
  isTest: boolean;
};

@Injectable()
export class DatasetService {
  constructor(
    @InjectRepository(Dataset)
    private readonly datasetRepo: Repository<Dataset>,
    private readonly searchService: SearchService,
  ) {}

  findById(id: string): Promise<Dataset> {
    return this.datasetRepo.findOne(id);
  }

  findByIds(ids: string[]): Promise<Dataset[]> {
    return this.datasetRepo.findByIds(ids);
  }

  async uniqueDepartmentsForPortal(
    portalId: string,
    limit?: number,
    offset?: number,
    search?: string,
    isGlobal?: boolean,
  ) {
    let baseQuery = this.datasetRepo.createQueryBuilder('dataset');
    console.log('looking at portal', portalId);
    if (isGlobal) {
      baseQuery = baseQuery.where('1=1');
    } else {
      baseQuery = baseQuery.where('"portalId" = :portal', {
        portal: portalId,
      });
    }

    //TODO make this safer
    if (search) {
      baseQuery = baseQuery.andWhere('department ilike :search', {
        search: `%${search}%`,
      });
    }

    const { total } = await baseQuery
      .clone()
      .select('COUNT(DISTINCT department) as total')
      .getRawOne();

    let departmentQuery = baseQuery
      .clone()
      .select('department')
      .addSelect('COUNT(*)', 'occurrences')
      .groupBy('department')
      .andWhere('department is not null')
      .andWhere("department != ''")
      .orderBy('occurrences', 'DESC');

    if (limit) {
      departmentQuery = departmentQuery.take(limit);
    }

    if (offset) {
      departmentQuery = departmentQuery.skip(offset);
    }

    const result = await departmentQuery.getRawMany();
    const pagedResult = {
      items: result,
      total,
    };
    return Promise.resolve(pagedResult as PagedDepartmentCount);
  }

  async uniqueCategoriesForPortal(
    portalId: string,
    limit?: number,
    offset?: number,
    search?: string,
    isGlobal?: boolean,
  ) {
    // TODO model the data better, with a separate categories table.
    // That way we don't have to manually do everything in-memory here.

    let query = this.datasetRepo.createQueryBuilder('dataset');
    if (isGlobal) {
      query = query.where('1=1');
    } else {
      query = query.where('"portalId" = :portal', {
        portal: portalId,
      });
    }

    query = query
      .select('categories')
      .addSelect('COUNT(*)', 'occurrences')
      .groupBy('categories');

    const groupedCategoriesResult: Array<{
      categories: string;
      occurrences: string;
    }> = await query.getRawMany();

    const addCategoryCountToMap = (
      map: Map<string, number>,
      category: string,
      count: number,
      allowNew: boolean,
    ): Map<string, number> => {
      // empty values got cast to an 'undefined' string, so ignore them
      if (category === 'undefined') {
        return map;
      }

      const currCount = map.get(category);
      if (currCount === undefined && !allowNew) {
        return map;
      }

      return currCount === undefined
        ? map.set(category, count)
        : map.set(category, currCount + count);
    };

    // now process all categories to get the finalized counts
    const categoryToCount = groupedCategoriesResult.reduce(
      (
        countMap: Map<string, number>,
        tuple: {
          categories: string;
          occurrences: string;
        },
      ) => {
        const categoriesGroup = tuple.categories
          .split(',')
          .map(c => c.trim().toLowerCase());
        const count = Number(tuple.occurrences);

        return categoriesGroup.reduce(
          (map: Map<string, number>, categoryLabel: string) => {
            const newMap = addCategoryCountToMap(
              map,
              categoryLabel,
              count,
              true,
            );

            // TODO: simplify this. Elastic search's fuzzy searching
            // allows things like "Administration & Finance" to match
            // with "Finance" which makes our numbers in the Filters
            // checkboxes to look wrong
            const categoriesExcludingThisOne = categoriesGroup.filter(
              c => c !== categoryLabel,
            );

            // now split the category by spaces, in case any sub-parts of
            // each cateogry has a match
            return categoryLabel
              .split(' ')
              .map(c => c.trim().toLowerCase())
              .filter(c => {
                if (c === categoryLabel) {
                  return false;
                }

                return !categoriesExcludingThisOne.includes(c);
              })
              .reduce((m, c) => {
                return addCategoryCountToMap(m, c, count, false);
              }, newMap);
          },
          countMap,
        );
      },
      new Map<string, number>(),
    );

    const categoryCounts: CategoryCount[] = [...categoryToCount.entries()].map(
      ([category, count]) => ({
        category,
        occurrences: count,
      }),
    );

    // filter by search term
    const filteredCategoriesBySearch = search
      ? categoryCounts.filter(({ category }) => category.includes(search))
      : categoryCounts;

    // sort by count in descending order
    const sortedCategories = filteredCategoriesBySearch.sort(
      (c1, c2) => c2.occurrences - c1.occurrences,
    );

    // apply offset and limit
    const slicedCategories = sortedCategories.slice(offset, offset + limit);
    const pagedResult: PagedCategoryCount = {
      items: slicedCategories,
      total: categoryCounts.reduce(
        (sum, catObj) => sum + catObj.occurrences,
        0,
      ),
    };

    return Promise.resolve(pagedResult);
  }

  async search(
    portal?: string,
    limit?: number,
    offset?: number,
    search?: string,
    datasetColumns?: string[],
    categories?: string[],
    departments?: string[],
  ): Promise<PagedDatasets> {
    const searchResults = await this.searchService.search(
      search,
      portal,
      offset,
      limit,
      datasetColumns,
      categories,
      departments,
    );
    console.log('Returned search results', { searchResults });

    const results = await this.datasetRepo.findByIds(searchResults.ids);

    return Promise.resolve({
      datasets: results,
      total: searchResults.total,
    }) as Promise<PagedDatasets>;
  }

  /**
   * Get all the dataset ids that exist in a given portal
   */
  async getAllDatasetIds(portalId: string): Promise<string[]> {
    const pageSize = 300;
    const numDatasets = await this.datasetRepo.count({
      where: { portalId },
    });
    const numPages = Math.ceil(numDatasets / pageSize);
    const datasetPages = await Promise.all(
      [...Array(numPages)].map((_, pageIdx: number) =>
        this.datasetRepo.find({
          order: { id: 'ASC' },
          select: ['id'],
          where: {
            portalId,
          },
          take: pageSize,
          skip: pageSize * pageIdx,
        }),
      ),
    );
    const allIds: string[] = [];
    datasetPages.forEach(datasets => {
      allIds.push(...datasets.map(dataset => dataset.id));
    });
    return allIds;
  }

  findAll(limit?: number, offset?: number): Promise<Dataset[]> {
    return this.datasetRepo.find({
      order: {
        id: 'ASC',
      },
      where: {},
      take: limit,
      skip: offset,
    });
  }

  /**
   * Get all datasets with their columns to insert into elasticsearch. We only
   * get datasets how `metadataUpdatedAt` date is after the
   * `lastMetadataUpdateDate` arg (which should be formatted in YYYY-MM-DD format).
   * If `portalIds` are passed then we limit the datasets to just those portals.
   */
  async findAllForElasticSearchInsertion(
    limit?: number,
    offset?: number,
    portalIds?: string[],
    lastMetadataUpdateDate: string = '1970-01-01',
  ): Promise<DatasetForElasticSearch[]> {
    const metadataUpdateDateFilter = {
      metadataUpdatedAt: MoreThanOrEqual(lastMetadataUpdateDate),
    };

    const whereClause = portalIds
      ? { ...metadataUpdateDateFilter, portalId: In(portalIds) }
      : metadataUpdateDateFilter;

    const datasets = await this.datasetRepo.find({
      select: [
        'id',
        'name',
        'description',
        'portalId',
        'department',
        'categories',
        'isTest',
      ],
      relations: ['datasetColumns'],
      order: {
        id: 'ASC',
      },
      where: whereClause,
      take: limit,
      skip: offset,
    });

    return datasets.map(dataset => ({
      ...dataset,
      datasetColumnFields: (dataset as any).__datasetColumns__.map(
        (col: DatasetColumn) => col.field,
      ),
    }));
  }

  /**
   * Get a count of how many datasets exist in the given portals with a
   * `metadataUpdatedAt` date that is after the `lastMetadataUpdateDate`
   */
  async countForPortals(
    portalIds: string[],
    lastMetadataUpdateDate: string,
  ): Promise<number> {
    return this.datasetRepo.count({
      where: {
        portalId: In(portalIds),
        metadataUpdatedAt: MoreThanOrEqual(lastMetadataUpdateDate),
      },
    });
  }

  /**
   * Get a count of how many datasets exist in the entire db with a
   * `metadataUpdatedAt` date that is after the `lastMetadataUpdateDate`
   */
  async countAll(lastMetadataUpdateDate: string): Promise<number> {
    return this.datasetRepo.count({
      where: {
        metadataUpdatedAt: MoreThanOrEqual(lastMetadataUpdateDate),
      },
    });
  }

  async findAllForPortal(
    portal: Portal,
    limit?: number,
    offset?: number,
  ): Promise<Dataset[]> {
    return this.datasetRepo.find({
      where: { portal: portal },
      take: limit,
      skip: offset,
    });
  }

  createOrUpdate(dataset: Dataset) {
    return this.datasetRepo.save(dataset);
  }

  /** Restore a soft-deleted dataset */
  restoreDataset(dataset: Dataset) {
    return this.datasetRepo.restore(dataset);
  }

  async deleteDatasets(datasetIds: string[]) {
    return this.datasetRepo.softDelete(datasetIds);
  }
}
