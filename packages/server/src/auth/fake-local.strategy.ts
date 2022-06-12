import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigService } from '../config/config.service';

/**
 * This Auth strategy is used by the FakeLocalAuthGuard to validate that
 * a given email is in the database. This auth strategy should only
 * be used in development. If not in development then it returns an
 * error.
 *
 * This auth strategy is used to validate a user on login (only in
 * development).
 */
@Injectable()
export class FakeLocalStrategy extends PassportStrategy(
  Strategy,
  'fake-local',
) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    // this is fake auth, so we just set `passwordField` to `email` just
    // to make this work.
    super({ usernameField: 'email', passwordField: 'email' });
  }

  /**
   * This validate function only takes in an email. We aren't using a
   * password as the second argument because this fake auth strategy should
   * only be used in development.
   */
  async validate(email: string): Promise<any> {
    if (this.authService.isFakeAuthEnabled()) {
      const user = await this.authService.fakeValidateUser(email);
      if (user) {
        return user;
      }
    }

    throw new UnauthorizedException();
  }
}
