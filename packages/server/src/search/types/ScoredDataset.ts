import { ObjectType, Field, Float } from '@nestjs/graphql';
import { Dataset } from '../../dataset/dataset.entity';

@ObjectType()
export class ScoredDataset {
  @Field(type => Dataset)
  dataset: Dataset;

  @Field(type => Float)
  score: number;
}
