import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { FakeLocalStrategy } from './fake-local.strategy';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { FakeJWTStrategy } from './fake-jwt.strategy';
import { AzureADStrategy } from './azure-ad.strategy';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        // since we only use the JWT token in development, we
        // set a 50 day expiry so that we don't have to bother
        // with refresh tokens.
        secret: configService.get('JWTSecret'),
        signOptions: { expiresIn: '50d' },
      }),
      inject: [ConfigService],
    }),
    PassportModule,
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, FakeLocalStrategy, FakeJWTStrategy, AzureADStrategy],
  exports: [AuthService],
})
export class AuthModule {}
