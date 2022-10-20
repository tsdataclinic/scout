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

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepo.findOne({ email });
  }

  async createUser(userObj: {
    email: string;
    familyName: string;
    givenName: string;
    id: string;
    identityProvider: string;
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
