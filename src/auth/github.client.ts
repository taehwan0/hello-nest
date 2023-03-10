import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { SocialInfoDto } from './dto/social-info.dto';
import { OauthClient } from './oauth.client';

@Injectable()
export class GithubClient implements OauthClient {
  private REQUEST_TOKEN_URL = 'https://github.com/login/oauth/access_token';
  private REQUEST_USER_INFO_URL = 'https://api.github.com/user';

  private CLIENT_ID = this.configService.get('GITHUB_CLIENT_ID');
  private SECRET_KEY = this.configService.get('GITHUB_SECRET_KEY');

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async getAccessToken(code: string): Promise<string> {
    const body = {
      grant_type: 'authorization_code',
      client_id: this.CLIENT_ID,
      accept: 'json',
      client_secret: this.SECRET_KEY,
      code: code,
    };

    const header = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        Accept: 'application/json',
      },
    };
    const response = await firstValueFrom(
      this.httpService.post(this.REQUEST_TOKEN_URL, body, header),
    );

    return response.data.access_token;
  }

  async getSocialInfo(accessToken: string): Promise<any> {
    const header = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        'X-GitHub-Api-Version': '2022-11-28',
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await firstValueFrom(
      this.httpService.get(this.REQUEST_USER_INFO_URL, header),
    );

    return SocialInfoDto.byGitHub(response);
  }
}
