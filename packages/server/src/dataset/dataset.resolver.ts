import { DatasetService } from './dataset.service';
import { Dataset, PagedDatasets } from './dataset.entity';
import { Portal } from '../portals/portal.entity';
import { Resolver, Parent, ResolveField, Query, Args } from '@nestjs/graphql';
import { SearchService } from '../search/search.service';
import { ScoredDataset } from '../search/types/ScoredDataset';

@Resolver(of => Dataset)
export class DatasetResolver {
  constructor(
    private datasetService: DatasetService,
    private searchService: SearchService,
  ) {}

  @Query(returns => [Dataset])
  async datasetsByIds(@Args('ids', { type: () => [String] }) ids: string[]) {
    return this.datasetService.findByIds(ids);
  }

  @Query(returns => Dataset)
  async dataset(@Args('id') id: string) {
    return this.datasetService.findById(id);
  }

  @Query(returns => [Dataset])
  async datasets(
    @Args('limit', { nullable: true }) limit?: number,
    @Args('offset', { nullable: true }) offset?: number,
  ) {
    return this.datasetService.findAll(limit, offset);
  }

  @Query(returns => PagedDatasets)
  async searchDatasets(
    @Args('portal', { nullable: true }) portal: string,
    @Args('limit', { nullable: true }) limit: number,
    @Args('offset', { nullable: true }) offset: number,
    @Args('search', { nullable: true }) search: string,
  ) {
    return this.datasetService.search(portal, limit, offset, search);
  }

  @ResolveField()
  async datasetColumns(@Parent() dataset: Dataset) {
    return dataset.datasetColumns;
  }

  @ResolveField()
  async portal(@Parent() dataset: Dataset) {
    const portal = await dataset.portal;
    return Promise.resolve(portal);
  }

  @ResolveField(returns => [ScoredDataset])
  async thematicallySimilarDatasets(
    @Parent() dataset: Dataset,
    @Args('portalId', { nullable: true }) portalId: string,
  ) {
    return this.searchService.thematicallySimilarForDataset(dataset, portalId);
  }
}
