import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Dataset } from '../dataset/dataset.entity';

@ObjectType()
@Entity()
export class ThematicSuggestion {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  similarity: number;

  @Column({ type: 'string', nullable: false })
  datasetId: string;

  @Column({ type: 'string', nullable: false })
  suggestionId: string;

  @Field(type => Dataset)
  @ManyToOne(
    type => Dataset,
    dataset => dataset.thematicSuggestions,
  )
  dataset: Promise<Dataset>;

  @Field(type => Dataset)
  @ManyToOne(
    type => Dataset,
    dataset => dataset,
  )
  suggestion: Promise<Dataset>;

  /*  @Field(type => Int)
  thematicSuggestionCount: number;

  @Field(type => Int)
  joinCount: number;
  */
}
