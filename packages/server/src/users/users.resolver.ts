import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { User } from './users.entity';
import { Resolver, Query, Args, ResolveField, Parent } from '@nestjs/graphql';
import {
  DataClinicAuthGuard,
  CurrentUser,
} from '../auth/data-clinic-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Collection } from '../collections/collections.entity';

@Resolver(of => User)
export class UserResolver {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Query(returns => User)
  async user(@Args('id') id: string) {
    return this.userService.findById(id);
  }

  @Query(returns => User)
  @UseGuards(DataClinicAuthGuard)
  async profile(@CurrentUser() user: User) {
    return user;
  }

  @ResolveField(returns => [Collection])
  async collections(@Parent() user: User): Promise<Collection[]> {
    return Promise.resolve(this.userService.collectionsForUser(user));
  }
}
