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

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepo.findOne({ email });
  }
  async findById(id: string): Promise<User | undefined> {
    return this.userRepo.findOne({ id });
  }

  async createUser(email: string, username: string, password: string) {
    const user = this.userRepo.create({ email, username, password });
    return this.userRepo.save(user);
  }
}
