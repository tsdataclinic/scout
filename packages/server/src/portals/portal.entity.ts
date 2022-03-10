import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Dataset,
  PagedDatasets,
  PagedCategoryCount,
  PagedDepartmentCount,
} from '../dataset/dataset.entity';
import {
  DatasetColumn,
  PagedFieldCount,
} from '../dataset-columns/dataset-column.entity';

@ObjectType()
@Entity()
export class Portal {
  @Field()
  @PrimaryColumn({ type: String, unique: true })
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  baseURL: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  logo: string;

  @Field()
  @Column({ default: 'City' })
  adminLevel: string;

  @Field()
  @Column()
  datasetCount: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  abbreviation: string;

  @Field(type => PagedDepartmentCount)
  uniqueDepartments: PagedDepartmentCount;

  @Field(type => PagedCategoryCount)
  uniqueCategories: PagedCategoryCount;

  @Field(type => PagedFieldCount)
  uniqueColumnFields: PagedFieldCount;

  @Field(type => [DatasetColumn])
  @OneToMany(type => DatasetColumn, datasetColumn => datasetColumn.portal)
  datasetColumns: Promise<DatasetColumn[]>;

  @Field(type => [Dataset])
  @OneToMany(type => Dataset, dataset => dataset.portal)
  datasets: Promise<Dataset[]>;

  @Field(type => PagedDatasets)
  searchDatasets: Promise<PagedDatasets>;
}
