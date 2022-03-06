import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findById(id: string): Promise<User | undefined> {
    return this.userRepo.findOne({ id });
  }

  async createUser(userObj: {
    id: string;
    identityProvider: string;
    email: string;
    givenName: string;
    familyName: string;
  }): Promise<User> {
    const user = this.userRepo.create(userObj);
    return this.userRepo.save(user);
  }

  async collectionsForUser(user: User) {
    const { collections } = await this.userRepo.findOne(
      { id: user.id },
      { relations: ['collections'] },
    );
    return collections;
  }
}
