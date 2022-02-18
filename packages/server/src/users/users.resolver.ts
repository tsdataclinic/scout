import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { User } from './users.entity';
import {
  Resolver,
  Query,
  Args,
  Mutation,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { LoginResult, SignupResult } from './signin.types';
import { GqlAuthGuard, CurrentUser } from '../auth/gql-auth-guard';
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
  @UseGuards(GqlAuthGuard)
  async profile(@CurrentUser() user: User) {
    return user;
  }

  @Mutation(returns => SignupResult)
  async signUp(
    @Args('username') userename: string,
    @Args('password') password: string,
    @Args('email') email: string,
  ) {
    try {
      const result = await this.userService.createUser(
        email,
        userename,
        password,
      );

      const token = await this.authService.login(result);
      return { success: true, token: token.access_token };
    } catch (err) {
      if (err.code === 'SQLITE_CONSTRAINT') {
        const errString = err.toString();
        if (errString.includes('email')) {
          return { success: false, error: 'Email address already taken' };
        }
        if (errString.includes('username')) {
          return { success: false, error: 'Username already taken' };
        }
        return { success: false, error: err };
      }
    }
  }

  @Mutation(returns => LoginResult, { nullable: true })
  async signIn(
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    const user = await this.authService.validateUser(email, password);
    if (user) {
      const token = await this.authService.login(user);
      return { token: token.access_token };
    } else {
      return { error: 'Username or password incorrect' };
    }
  }

  @ResolveField(returns => [Collection])
  async collections(@Parent() user: User): Promise<Collection[]> {
    return Promise.resolve(this.userService.collectionsForUser(user));
  }
}
