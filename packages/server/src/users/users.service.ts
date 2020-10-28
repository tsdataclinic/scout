import { Injectable } from '@nestjs/common';

export type User = {
  userId: number;
  username: string;
  password: string;
};

@Injectable()
export class UsersService {
  private readonly users: User[];

  constructor() {
    this.users = [
      {
        userId: 1,
        username: 'stuart',
        password: 'stuart',
      },
      {
        userId: 2,
        username: 'lynn',
        password: 'lynn',
      },
    ];
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }
}
