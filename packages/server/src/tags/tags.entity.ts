import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  JoinColumn,
} from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';
import { Dataset } from '../dataset/dataset.entity';
import { Portal } from '../portals/portal.entity';

@ObjectType()
@Entity()
export class Tag {
  @Field()
  @PrimaryGeneratedColumn()
  id: string;

  @Field()
  @Column()
  name: string;

  @Field(type => Portal)
  @ManyToOne(type => Portal)
  @JoinColumn({ name: 'portal_id', referencedColumnName: 'id' })
  portal: Portal;

  @Field(type => [Dataset])
  @ManyToMany(type => Dataset, { cascade: true })
  @JoinTable({
    name: 'tag_use_dataset',
    joinColumn: { name: 'tag_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'dataset_id', referencedColumnName: 'id' },
  })
  datasets: Dataset[];
}
