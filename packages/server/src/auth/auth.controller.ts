import { Controller, UseGuards, Request, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FakeLocalAuthGuard } from './fake-local-auth.guard';

/**
 * Manages REST endpoints for our fake auth flow to be used in
 * local development.
 */
@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(FakeLocalAuthGuard)
  @Post('login')
  async login(@Request() req: any) {
    const { email } = req.body;
    return this.authService.fakeLogin(email);
  }

  @Post('register')
  async register(@Request() req: any) {
    const { email, firstName, lastName } = req.body;
    return this.authService.fakeRegister(email, firstName, lastName);
  }
}
