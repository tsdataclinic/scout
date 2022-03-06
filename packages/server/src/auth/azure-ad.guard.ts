import {
  ExecutionContext,
  Injectable,
  createParamDecorator,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AzureADGuard extends AuthGuard('azure-ad') {
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
