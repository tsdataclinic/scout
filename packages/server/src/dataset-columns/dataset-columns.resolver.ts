import { DatasetColumnsService } from './dataset-columns.service';
import { DatasetColumn, JoinSuggestion } from './dataset-column.entity';
import { Dataset } from '../dataset/dataset.entity';
import {
  Resolver,
  Parent,
  ResolveField,
  Query,
  Args,
  Int,
} from '@nestjs/graphql';

@Resolver(of => DatasetColumn)
export class DatasetColumnsResolver {
  constructor(private datasetColumnsService: DatasetColumnsService) {}

  @Query(returns => DatasetColumn)
  async datasetColumn(@Args('id', { type: () => Int }) id: number) {
    return this.datasetColumnsService.findById(id);
  }

  @Query(returns => [DatasetColumn])
  async datasetColumns() {
    return this.datasetColumnsService.findAll();
  }

  @ResolveField()
  async dataset(@Parent() column: DatasetColumn) {
    return await column.dataset;
  }

  @ResolveField()
  async joinSuggestionCount(
    @Parent() column: DatasetColumn,
    @Args('global', { defaultValue: false }) global: boolean,
  ) {
    return this.datasetColumnsService.countJoinableColumns(column, global);
  }

  @ResolveField()
  async joinSuggestions(
    @Parent() column: DatasetColumn,
    @Args('global', { defaultValue: false }) global: boolean,
    @Args('limit', { nullable: true, type: () => Int }) limit: number,
    @Args('offset', { nullable: true, type: () => Int }) offset: number,
  ) {
    return this.datasetColumnsService.findJoinableColumns(
      column,
      global,
      limit,
      offset,
    );
  }
}
