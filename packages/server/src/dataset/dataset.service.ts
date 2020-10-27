import { Injectable } from '@nestjs/common';
import { Dataset, PagedDatasets } from './dataset.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Portal } from '../portals/portal.entity';
import { SearchService } from 'src/search/search.service';

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

  async search(
    portal?: string,
    limit?: number,
    offset?: number,
    search?: string,
  ): Promise<PagedDatasets> {
    console.log('HERE');
    const searchResults = await this.searchService.search(
      search,
      portal,
      offset,
      limit,
    );

    const results = await this.datasetRepo.findByIds(searchResults.ids);

    return Promise.resolve({
      datasets: results,
      total: searchResults.total,
    }) as Promise<PagedDatasets>;
  }

  findAll(limit?: number, offset?: number): Promise<Dataset[]> {
    return this.datasetRepo.find({
      where: {},
      take: limit,
      skip: offset,
    });
  }

  count(): Promise<number> {
    return this.datasetRepo.count();
  }

  // async countThematicSuggestions(){
  //   return this.datasetRepo.createQueryBuilder().
  // }

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
