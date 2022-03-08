import { PassportStrategy } from '@nestjs/passport';
import { BearerStrategy } from 'passport-azure-ad';
import { Injectable } from '@nestjs/common';
import { User } from '../users/users.entity';
import { UsersService } from '../users/users.service';
import { ConfigService } from '../config/config.service';

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
  constructor(
    private configService: ConfigService,
    private userService: UsersService,
  ) {
    super({
      identityMetadata: configService.get(
        'SCOUT_SERVER_AZURE_B2C_IDENTITY_METADATA_URI',
      ),
      clientID: configService.get('SCOUT_SERVER_AZURE_APP_CLIENT_ID'),
      loggingLevel: null,

      // required for Azure AD B2C
      policyName: configService.get('SCOUT_SERVER_AZURE_B2C_AUTH_POLICY_NAME'),

      // required for Azure AD B2C
      isB2C: true,

      // required for Azure AD B2C
      validateIssuer: false,
    });
    console.log(
      'identity URI',
      configService.get('SCOUT_SERVER_AZURE_B2C_IDENTITY_METADATA_URI'),
    );
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
