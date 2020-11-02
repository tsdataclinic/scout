import {
  Entity,
  Column,
  BeforeInsert,
  PrimaryGeneratedColumn,
  PrimaryColumn,
  Unique,
} from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import * as bcrypt from 'bcrypt';

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
  @PrimaryColumn({ unique: true })
  email: string;

  @Field()
  @Column()
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(attempt: string): Promise<boolean> {
    return await bcrypt.compare(attempt, this.password);
  }
}
