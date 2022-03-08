import axios from 'axios';
import { Headers, Controller, Get, Post, Body, Param } from '@nestjs/common';
import { GithubService } from './github.service';
import { ConfigService } from 'src/config/config.service';
import { CommitResult, CodeResult } from './types';

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
        client_id: this.configService.get('SCOUT_SERVER_GITHUB_CLIENT_ID'),
        client_secret: this.configService.get(
          'SCOUT_SERVER_GITHUB_CLIENT_SECRET',
        ),
      },
      {
        headers: { Accept: 'application/json' },
      },
    );

    if (response.status === 200) {
      if (response.data.error) {
        console.log('Error in github authentication', response.data);
        return { token: null };
      }
      return { token: response.data.access_token };
    }

    throw new Error(
      `ERROR: Github authentication returned status ${response.status}`,
    );
  }

  @Get('search/code/:datasetId')
  async getGithubCodeSearchResults(
    @Headers('Authorization') githubAuthToken: string,
    @Param('datasetId') datasetId: string,
  ): Promise<CodeResult[]> {
    return this.githubService.getGithubCodeSearchResults(
      datasetId,
      githubAuthToken,
    );
  }

  @Get('search/commits/:datasetId')
  async getGithubCommitSearchResults(
    @Headers('Authorization') githubAuthToken: string,
    @Param('datasetId') datasetId: string,
  ): Promise<CommitResult[]> {
    return this.githubService.getGithubCommitSearchResults(
      datasetId,
      githubAuthToken,
    );
  }
}
