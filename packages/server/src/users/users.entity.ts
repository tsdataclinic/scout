import {
  Entity,
  Column,
  BeforeInsert,
  PrimaryGeneratedColumn,
  PrimaryColumn,
  Unique,
  OneToMany,
} from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import * as bcrypt from 'bcrypt';
import { Collection } from 'src/collections/collections.entity';

@ObjectType()
@Entity()
@Unique(['email'])
@Unique(['username'])
export class User {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  username: string;

  @Field()
  @Column()
  email: string;

  @Field()
  @Column()
  password: string;

  @Field(type => [Collection])
  @OneToMany(
    () => Collection,
    collection => collection.user,
  )
  collections: Promise<Collection[]>;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(attempt: string): Promise<boolean> {
    return await bcrypt.compare(attempt, this.password);
  }
}
