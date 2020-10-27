import { DatasetColumnsService } from './dataset-columns.service';
import { DatasetColumn, JoinSuggestion } from './dataset-column.entity';
import { Dataset } from '../dataset/dataset.entity';
import { Resolver, Parent, ResolveField, Query, Args } from '@nestjs/graphql';

@Resolver(of => DatasetColumn)
export class DatasetColumnsResolver {
  constructor(private datasetColumnsService: DatasetColumnsService) {}

  @Query(returns => Dataset)
  async datasetColumn(@Args('id') id: string) {
    return this.datasetColumnsService.findById(id);
  }

  @Query(returns => [Dataset])
  async datasetColumns() {
    return this.datasetColumnsService.findAll();
  }

  @ResolveField()
  async dataset(@Parent() column: DatasetColumn) {
    return await column.dataset;
  }

  @ResolveField()
  async joinSuggestions(
    @Parent() column: DatasetColumn,
    @Args('global', { defaultValue: false }) global: boolean,
  ) {
    return this.datasetColumnsService.findJoinableColumns(column, global);
  }
}
