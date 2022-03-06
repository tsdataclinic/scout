import { PassportStrategy } from '@nestjs/passport';
import { BearerStrategy } from 'passport-azure-ad';
import { Injectable } from '@nestjs/common';
import { User } from '../users/users.entity';
import { UsersService } from '../users/users.service';

type AzureADB2CToken = {
  // issuer (includes tenant id)
  iss: string;
  exp: number;
  nbf: number;
  aud: string;
  given_name: string;
  family_name: string;
  // identity provider
  idp?: string;
  // the user's global Object ID
  oid: string;
  // subject claim (defaults to the Object ID in Azure AD B2C)
  sub: string;
  // emails associated to this user
  emails: string[];
  // policy name
  tfp: string;
  nonce: string;
  // allowed API scopes
  scp: string;
  azp: string;
  ver: string;
  iat: number;
};

/**
 * Extracts ID token from header and validates it
 */
@Injectable()
export class AzureADStrategy extends PassportStrategy(
  BearerStrategy,
  'azure-ad',
) {
  constructor(private userService: UsersService) {
    // TODO: get this from configService (as env vars)
    super({
      identityMetadata:
        'https://twosigmadataclinic.b2clogin.com/twosigmadataclinic.onmicrosoft.com/v2.0/.well-known/openid-configuration',
      clientID: 'e721ad4d-7392-4ef5-a5a8-36250b38e3a3',
      loggingLevel: null,

      // required for Azure AD B2C
      policyName: 'B2C_1_scout_signup_signin',

      // required for Azure AD B2C
      isB2C: true,

      // required for Azure AD B2C
      validateIssuer: false,
    });
  }

  /**
   * Azure AD B2C returns a token if auth succeeds, so it means that by the
   * time passport calls this `validate` function then we are guaranteed
   * that the token is already valid.
   */
  async validate(token: AzureADB2CToken): Promise<User> {
    const userId = token.oid;
    const user = await this.userService.findById(userId);
    if (user) {
      return user;
    }

    // user could not be found, so let's create it
    return this.userService.createUser({
      id: userId,
      email: token.emails[0] || '', // just take the first email
      identityProvider: token.idp || 'local',
      givenName: token.given_name,
      familyName: token.family_name,
    });
  }
}
