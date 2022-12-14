import { Entity, Column, ManyToOne, PrimaryColumn, Index } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';
import { Dataset } from '../dataset/dataset.entity';
import { Portal } from '../portals/portal.entity';

@ObjectType()
@Entity()
export class DatasetColumn {
  @Field()
  @PrimaryColumn()
  id: string;

  @Index()
  @Field()
  @Column()
  name: string;

  @Index()
  @Field()
  @Column()
  field: string;

  @Field()
  @Column()
  type: string;

  @Field()
  @Column({ nullable: true, default: '' })
  description: string;

  @Field(type => [JoinSuggestion])
  joinSuggestions: JoinSuggestion[];

  @Field()
  joinSuggestionCount: number;

  @Index()
  @Field(type => Portal)
  @ManyToOne(type => Portal, portal => portal.id)
  portal: Promise<Portal>;

  @Field(type => Dataset)
  @ManyToOne(type => Dataset, dataset => dataset.id, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  dataset: Promise<Dataset>;
}

@ObjectType()
export class JoinSuggestion {
  @Field(type => DatasetColumn)
  column: DatasetColumn;

  @Field()
  potentialOverlap: number;
}

@ObjectType()
export class FieldCount {
  @Field()
  field: string;

  @Field()
  occurrences: number;
}

@ObjectType()
export class PagedFieldCount {
  @Field(type => [FieldCount])
  items: FieldCount[];

  @Field()
  total: Number;
}
