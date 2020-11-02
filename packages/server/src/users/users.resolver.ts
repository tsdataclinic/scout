import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { User } from './users.entity';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { LoginResult, SignupResult } from './signin.types';
import { GqlAuthGuard, CurrentUser } from '../auth/gql-auth-guard';
import { QueryTypeFactory } from '@nestjs/graphql/dist/schema-builder/factories/query-type.factory';
import { UseGuards } from '@nestjs/common';

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
      return { success: true };
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
}
