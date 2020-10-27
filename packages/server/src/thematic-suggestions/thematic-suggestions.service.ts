import { Injectable } from '@nestjs/common';
import { ThematicSuggestion } from './thematic-suggestions.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ThematicSuggestionsService {
  constructor(
    @InjectRepository(ThematicSuggestion)
    private readonly thematicSuggestionRepo: Repository<ThematicSuggestion>,
  ) {}

  findAll(limit?: number, offset?: number): Promise<ThematicSuggestion[]> {
    return this.thematicSuggestionRepo.find({
      take: limit,
      skip: offset,
    });
  }

  async createBulk(suggestions: ThematicSuggestion[]) {
    return this.thematicSuggestionRepo
      .createQueryBuilder()
      .insert()
      .into(ThematicSuggestion)
      .values(suggestions)
      .execute();
  }

  async create(
    datasetId: string,
    similarDatasetId: string,
    similarity: number,
  ) {
    let suggestion = new ThematicSuggestion();
    suggestion.datasetId = datasetId;
    suggestion.suggestionId = similarDatasetId;
    suggestion.similarity = similarity;
    try {
      const result = await this.thematicSuggestionRepo.save(suggestion);
      return Promise.resolve(result);
    } catch (err) {
      console.log('Failed to create ', datasetId, similarDatasetId);
      console.log(err);
      return Promise.resolve();
    }
  }

  findByDataset(
    datasetId: string,
    limit?: number,
    offset?: number,
  ): Promise<ThematicSuggestion[]> {
    return this.thematicSuggestionRepo.find({
      where: { dataset1Id: datasetId },
      take: limit,
      skip: offset,
    });
  }
}
