import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '../config/config.service';

/**
 * This auth strategy is used to extract user information from a JWT
 * and is only used in development if fake auth is enabled. This strategy
 * is used in API calls that require authentication.
 *
 * The `validate` function just has to extract user information because
 * by the time we get to this funtion, the Passport library has already
 * validated the JWT. So at this point we know that the token is valid
 * and the user has been authenticated.
 */
@Injectable()
export class FakeJWTStrategy extends PassportStrategy(Strategy, 'fake-jwt') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      secretOrKey: configService.get('JWTSecret'),

      // this delegates the responsibility of ensuring the JWT has not expired
      // to the Passport module. So if any route is supplied with an expired JWT
      // the request will be denied with a `401 Unauthorized` response. Passport
      // handles this for us.
      ignoreExpiration: false,
    });
  }

  /**
   * `validate` receives a decoded JSON that contains the user information that
   * was encrypted into a JWT on login. If fake auth is not enabled then we
   * throw an UnauthorizedException.
   */
  async validate(payload: { sub: string; email: string }) {
    if (!this.authService.isFakeAuthEnabled()) {
      throw new UnauthorizedException();
    }

    return {
      id: payload.sub,
      email: payload.email,
    };
  }
}
