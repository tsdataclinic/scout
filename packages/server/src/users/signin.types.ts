import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class LoginResult {
  @Field({ nullable: true })
  token: string;

  @Field({ nullable: true })
  error: string;
}

@ObjectType()
export class SignupResult {
  @Field({ nullable: true })
  success: true;

  @Field({ nullable: true })
  error: string;
}
