import { Module } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { GithubService } from './github.service';
import { GithubController } from './github.controller';

@Module({
  controllers: [GithubController],
  providers: [GithubService, ConfigService],
})
export class GithubModule {}
