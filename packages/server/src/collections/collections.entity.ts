import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm';
import { Dataset } from '../dataset/dataset.entity';

import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../users/users.entity';

@ObjectType()
@Entity()
export class Collection {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  description: string;

  @ManyToMany(() => Dataset)
  @JoinTable()
  @Field(type => [Dataset])
  datasets: Promise<Dataset[]>;

  @Field(type => User)
  @ManyToOne(
    type => User,
    user => user,
  )
  @Field(type => User)
  user: Promise<User>;
}
