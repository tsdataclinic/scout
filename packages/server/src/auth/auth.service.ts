import { v4 as uuidv4 } from 'uuid';
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/users.entity';
import { ConfigService } from '../config/config.service';

export interface AccessTokenResponse {
  access_token: string;
}

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  isFakeAuthEnabled(): boolean {
    const fakeAuthEnvVar = this.configService.get('SCOUT_SERVER_USE_FAKE_AUTH');
    return (
      fakeAuthEnvVar !== 'false' &&
      fakeAuthEnvVar !== undefined &&
      fakeAuthEnvVar !== null
    );
  }

  getAccessToken(id: string, email: string): string {
    return this.jwtService.sign({
      email,

      // JWT standard is to use `sub` as property name for user id
      sub: id,
    });
  }

  /**
   * Implement a fake register function to use during development
   */
  async fakeRegister(
    email: string,
    firstName: string,
    lastName: string,
  ): Promise<AccessTokenResponse> {
    if (this.isFakeAuthEnabled()) {
      const user = await this.userService.findByEmail(email);
      if (user) {
        // user already exists so we should not recreate one
        throw new ConflictException('User already exists!');
      }

      const createdUser = await this.userService.createUser({
        email,
        id: uuidv4(),
        identityProvider: 'FAKE',
        givenName: firstName,
        familyName: lastName,
      });
      return {
        access_token: this.getAccessToken(createdUser.id, createdUser.email),
      };
    }

    throw new UnauthorizedException();
  }

  /**
   * Implement a fake login function to use during development.
   */
  async fakeLogin(email: string): Promise<AccessTokenResponse> {
    const user = await this.userService.findByEmail(email);
    return {
      access_token: this.getAccessToken(user.id, email),
    };
  }

  /**
   * Implement a fake user validation function to use during development.
   * This lets us bypass Azure AD B2C auth.
   */
  async fakeValidateUser(email: string): Promise<User | null> {
    const user = await this.userService.findByEmail(email);
    return user ?? null;
  }
}
