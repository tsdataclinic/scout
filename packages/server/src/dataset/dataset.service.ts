import { Injectable } from '@nestjs/common';
import {
  Dataset,
  PagedDatasets,
  PagedCategoryCount,
  PagedDepartmentCount,
  CategoryCount,
} from './dataset.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Portal } from '../portals/portal.entity';
import { SearchService } from '../search/search.service';
import { In } from 'typeorm';
import { DatasetColumn } from '../dataset-columns/dataset-column.entity';

export type DatasetForElasticSearch = {
  id: string;
  name: string;
  description: string;
  portalId: string;
  department: string;
  categories: string[];
  datasetColumnFields: string[];
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
  ) {
    let baseQuery = this.datasetRepo
      .createQueryBuilder('dataset')
      .where('"portalId" = :portal', {
        portal: portalId,
      });

    //TODO make this safer
    if (search) {
      baseQuery = baseQuery.andWhere('department ilike :search', {
        search: `%${search}%`,
      });
    }

    console.log('running the query');
    const { total } = await baseQuery
      .clone()
      .select('COUNT(DISTINCT department) as total')
      .getRawOne();
    console.log(total);

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
    console.log(result);
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
  ) {
    // TODO model the data better, with a separate categories table.
    // That way we don't have to manually do everything in-memory here.

    const query = this.datasetRepo
      .createQueryBuilder('dataset')
      .where('"portalId" = :portal', {
        portal: portalId,
      })
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
   * Get all datasets with their columns to insert into elasticsearch.
   * If `portalIds` are passed then we limit the datasets to just those portals.
   */
  async findAllForElasticSearchInsertion(
    limit?: number,
    offset?: number,
    portalIds?: string[],
  ): Promise<DatasetForElasticSearch[]> {
    const whereClause = portalIds ? { portalId: In(portalIds) } : {};
    const datasets = await this.datasetRepo.find({
      select: [
        'id',
        'name',
        'description',
        'portalId',
        'department',
        'categories',
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

  async countForPortals(portalIds: string[]): Promise<number> {
    return this.datasetRepo.count({
      where: {
        portalId: In(portalIds),
      },
    });
  }

  async countAll(): Promise<number> {
    return this.datasetRepo.count();
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
}
