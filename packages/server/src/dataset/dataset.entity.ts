import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';
import { Portal } from '../portals/portal.entity';
import { Collection } from '../collections/collections.entity';
import { DatasetColumn } from '../dataset-columns/dataset-column.entity';
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

  @Field(type => [String], { nullable: false })
  @Column({ type: 'simple-array', nullable: false, default: '' })
  categories: string[];

  @Field({ nullable: true })
  @Column({ type: 'timestamp with time zone', nullable: true })
  metadataUpdatedAt: Date;

  @Field({ nullable: true })
  @Column({ type: 'timestamp with time zone', nullable: true })
  updatedAt: Date;

  @Field({ nullable: true })
  @Column({ type: 'timestamp with time zone', nullable: true })
  createdAt: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  type: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  permalink: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  downloads: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  views: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  updateFrequency: string;

  @Column({ nullable: false })
  portalId: string;

  @Field(type => Portal)
  @ManyToOne(type => Portal, portal => portal.id)
  portal: Promise<Portal>;

  @Field(type => [Collection])
  @ManyToMany(() => Collection, collection => collection.datasets)
  collections: Promise<Collection>;

  @Field(type => [DatasetColumn])
  @OneToMany(type => DatasetColumn, datasetColumn => datasetColumn.dataset)
  datasetColumns: Promise<DatasetColumn[]>;

  @Field(type => [ScoredDataset])
  thematicallySimilarDatasets: Promise<Dataset[]>;

  @Field({ nullable: false })
  @Column({ nullable: false, default: false })
  isTest: boolean;
}

@ObjectType()
export class PagedDatasets {
  @Field(type => [Dataset])
  datasets: Dataset[];

  @Field()
  total: number;
}

@ObjectType()
export class CategoryCount {
  @Field()
  category: string;

  @Field()
  occurrences: number;
}

@ObjectType()
export class PagedCategoryCount {
  @Field(type => [CategoryCount])
  items: CategoryCount[];

  @Field()
  total: Number;
}

@ObjectType()
export class DepartmentCount {
  @Field()
  department: string;

  @Field()
  occurrences: number;
}

@ObjectType()
export class PagedDepartmentCount {
  @Field(type => [DepartmentCount])
  items: DepartmentCount[];

  @Field()
  total: Number;
}
