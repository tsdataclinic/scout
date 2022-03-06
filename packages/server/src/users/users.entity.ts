import { Entity, Column, PrimaryColumn, Unique, OneToMany } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';
import { Collection } from '../collections/collections.entity';

@ObjectType()
@Entity()
export class User {
  // Azure Object ID for this user
  @Field()
  @PrimaryColumn()
  id: string;

  @Field()
  @Column()
  email: string;

  @Field()
  @Column()
  identityProvider: string;

  @Field()
  @Column()
  familyName: string;

  @Field()
  @Column()
  givenName: string;

  @Field(type => [Collection])
  @OneToMany(() => Collection, collection => collection.user)
  collections: Promise<Collection[]>;
}
