import { PortalService } from './portal.service';
import { DatasetService } from '../dataset/dataset.service';
import { DatasetColumnsService } from '../dataset-columns/dataset-columns.service';
import { Portal } from './portal.entity';
import { Resolver, Query, Parent, Args, ResolveField } from '@nestjs/graphql';
import { FieldCount } from '../dataset-columns/dataset-column.entity';
import { PagedDatasets } from '../dataset/dataset.entity';

@Resolver(of => Portal)
export class PortalResolver {
  constructor(
    private portalService: PortalService,
    private readonly datasetService: DatasetService,
    private readonly datasetColumnService: DatasetColumnsService,
  ) {}

  @Query(returns => Portal)
  async portal(@Args('id') id: string) {
    return this.portalService.findById(id);
  }

  @Query(returns => [Portal])
  async portals() {
    return this.portalService.findAll();
  }

  @ResolveField()
  async uniqueDepartments(
    @Parent() portal: Portal,
    @Args('limit', { nullable: true }) limit?: number,
    @Args('offset', { nullable: true }) offset?: number,
    @Args('search', { nullable: true }) search?: string,
    @Args('isGlobal', { nullable: true }) isGlobal?: boolean,
  ) {
    return this.datasetService.uniqueDepartmentsForPortal(
      portal.id,
      limit,
      offset,
      search,
      isGlobal,
    );
  }

  @ResolveField()
  async uniqueCategories(
    @Parent() portal: Portal,
    @Args('limit', { nullable: true }) limit?: number,
    @Args('offset', { nullable: true }) offset?: number,
    @Args('search', { nullable: true }) search?: string,
    @Args('isGlobal', { nullable: true }) isGlobal?: boolean,
  ) {
    return this.datasetService.uniqueCategoriesForPortal(
      portal.id,
      limit,
      offset,
      search,
      isGlobal,
    );
  }

  @ResolveField()
  async uniqueColumnFields(
    @Parent() portal: Portal,
    @Args('limit', { nullable: true }) limit?: number,
    @Args('offset', { nullable: true }) offset?: number,
    @Args('search', { nullable: true }) search?: string,
    @Args('isGlobal', { nullable: true }) isGlobal?: boolean,
  ) {
    return this.datasetColumnService.uniqueCountsForPortal(
      portal.id,
      limit,
      offset,
      search,
      isGlobal,
    );
  }

  @ResolveField('datasets', returns => PagedDatasets)
  async datasets(
    @Parent() portal: Portal,
    @Args('limit', { nullable: true }) limit: number,
    @Args('offset', { nullable: true }) offset: number,
  ) {
    return this.datasetService.findAll(limit, offset);
  }

  @ResolveField(returns => PagedDatasets)
  async searchDatasets(
    @Parent() portal: Portal,
    @Args('limit', { nullable: true }) limit: number,
    @Args('offset', { nullable: true }) offset: number,
    @Args('search', { nullable: true }) search: string,
  ) {
    return this.datasetService.search(portal.id, limit, offset, search);
  }
}
