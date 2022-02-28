import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { GithubService } from './github.service';
import { ConfigService } from 'src/config/config.service';
import { CommitResult, CodeResult } from './types';
import axios from 'axios';

interface GithubAuthDTO {
  authCode: string;
}

@Controller('api/github')
export class GithubController {
  constructor(
    private readonly githubService: GithubService,
    private readonly configService: ConfigService,
  ) {}

  @Post('authenticate')
  async authenticate(
    @Body() authParams: GithubAuthDTO,
  ): Promise<{ token: string | null }> {
    // TODO: move all this logic to GithubService
    const { authCode } = authParams;
    const response = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        code: authCode,
        client_id: this.configService.get('REACT_APP_SCOUT_GITHUB_CLIENT_ID'),
        client_secret: this.configService.get('SCOUT_GITHUB_CLIENT_SECRET'),
      },
      {
        headers: { Accept: 'application/json' },
      },
    );
    if (response.status === 200) {
      console.log(response.data);
      if (response.data.error) {
        console.log('Error', response.data);
        return { token: null };
      }
      const token = response.data.access_token;
      console.log('SUCCESS', response.data);
      console.log('SUCCESS', response.data.access_token);
      console.log(`Successfully generated github token: ${token}`);
      return { token };
    }

    console.log('Request failed');
    return { token: null };
  }

  @Get('search/:searchType')
  async getGithubCommitSearchResults(
    @Param('searchType') searchType: 'commits' | 'code',
  ): Promise<CommitResult | CodeResult | string> {
    return this.githubService.getGithubSearchResults(searchType);
  }
}
