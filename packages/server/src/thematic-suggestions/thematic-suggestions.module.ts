import { Module } from '@nestjs/common';
import { ThematicSuggestionsService } from './thematic-suggestions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThematicSuggestionsResolver } from './thematic-suggestions.resolver';
import { ThematicSuggestion } from './thematic-suggestions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ThematicSuggestion])],
  providers: [ThematicSuggestionsService, ThematicSuggestionsResolver],
  exports: [ThematicSuggestionsService],
})
export class ThematicSuggestionsModule {}
