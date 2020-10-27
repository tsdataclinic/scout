import { Entity, Column, PrimaryColumn, ManyToOne, OneToMany } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Portal } from '../portals/portal.entity';
import {
  DatasetColumn,
  FieldCount,
} from '../dataset-columns/dataset-column.entity';
import { ScoredDataset } from '../search/types/ScoredDataset';

@ObjectType()
@Entity()
export class Dataset {
  @Field()
  @PrimaryColumn()
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  description: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  department: string;

  @Field({ nullable: true })
  @Column({ type: 'datetime', nullable: true })
  metadataUpdatedAt: Date;

  @Field({ nullable: true })
  @Column({ type: 'datetime', nullable: true })
  updatedAt: Date;

  @Field({ nullable: true })
  @Column({ type: 'datetime', nullable: true })
  createdAt: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  type: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  permalink: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  classification: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  downloads: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  views: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  updateFrequency: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  updatedAutomation: boolean;

  @Column({ nullable: false })
  portalId: string;

  @Field(type => Portal)
  @ManyToOne(
    type => Portal,
    portal => portal.id,
  )
  portal: Promise<Portal>;

  @Field(type => [DatasetColumn])
  @OneToMany(
    type => DatasetColumn,
    datasetColumn => datasetColumn.dataset,
  )
  datasetColumns: Promise<DatasetColumn[]>;

  @Field(type => [ScoredDataset])
  thematicallySimilarDatasets: Promise<Dataset[]>;
}

@ObjectType()
export class PagedDatasets {
  @Field(type => [Dataset])
  datasets: Dataset[];

  @Field()
  total: number;
}
