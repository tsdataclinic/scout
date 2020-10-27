import { ThematicSuggestionsService } from './thematic-suggestions.service';
import { ThematicSuggestion } from './thematic-suggestions.entity';
import { Dataset } from '../dataset/dataset.entity';
import { Resolver, Parent, ResolveField, Query, Args } from '@nestjs/graphql';

@Resolver(of => ThematicSuggestion)
export class ThematicSuggestionsResolver {
  constructor(private thematicSuggestionsService: ThematicSuggestionsService) {}

  @Query(returns => ThematicSuggestion)
  async thematicSuggestion(
    @Args('datasetId') datasetId: string,
    @Args('limit', { defaultValue: 20 }) limit: number,
    @Args('offset', { defaultValue: 0 }) offset: number,
  ) {
    return this.thematicSuggestionsService.findByDataset(
      datasetId,
      limit,
      offset,
    );
  }

  @Query(returns => [ThematicSuggestion])
  async thematicSuggestions(
    @Args('limit', { defaultValue: 20 }) limit: number,
    @Args('offset', { defaultValue: 0 }) offset: number,
  ) {
    return this.thematicSuggestionsService.findAll(limit, offset);
  }

  @ResolveField(type => Dataset)
  async dataset(@Parent() thematicSuggestion: ThematicSuggestion) {
    return thematicSuggestion.dataset;
  }

  @ResolveField(type => Dataset)
  async suggestion(@Parent() thematicSuggestion: ThematicSuggestion) {
    return thematicSuggestion.suggestion;
  }
}
