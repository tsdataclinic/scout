import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  /*
  async login(user: any) {
    const payload = { username: user.username, id: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUser(email: string, passwordAttempt: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (user) {
      const isPasswordCorrect = await user.comparePassword(passwordAttempt);
      if (isPasswordCorrect) {
        const { password, ...result } = user;
        return result;
      }
    }
    return null;
  }
  */
}
