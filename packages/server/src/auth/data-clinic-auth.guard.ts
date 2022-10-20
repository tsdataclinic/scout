import {
  ExecutionContext,
  Injectable,
  createParamDecorator,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

/**
 * This auth guard applies two auth strategies:
 * - AzureADStrategy (which in turn applies the BearerStrategy from the
 *   passport-azure-ad class)
 * - FakeJWTStrategy (which in turn applies passport-jwt's Strategy)
 *
 * Both of these validate the request's token in order to determine if
 * a user is authenticated.
 *
 * FakeJWTStrategy will only be used if AzureADStrategy fails and if
 * fake auth is enabled (which should only happen in development).
 */
@Injectable()
export class DataClinicAuthGuard extends AuthGuard(['azure-ad', 'fake-jwt']) {
  /**
   * We need to override the `getRequest()` method in order
   * to use the AuthGuard with GraphQL. This is taken straight
   * from the NestJS docs:
   * https://docs.nestjs.com/security/authentication#graphql
   */
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}

/**
 * To get the current authenticated user in a GraphQL resolver we
 * have to define a @CurrentUser() decorator.
 * This is taken straight from the NestJS docs:
 * https://docs.nestjs.com/security/authentication#graphql
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.user;
  },
);
