import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { SocialInfoDto } from './dto/social-info.dto';

@Injectable()
export class GithubClient {
  private REQUEST_TOKEN_URL = 'https://github.com/login/oauth/access_token';
  private REQUEST_USER_INFO_URL = 'https://kapi.kakao.com/v2/user/me';

  private CLIENT_ID = this.configService.get('GITHUB_CLIENT_ID');
  private REDIRECT_URL = this.configService.get('GITHUB_REDIRECT_URL');
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

  async getSocialInfo(accessToken: string): Promise<SocialInfoDto> {
    const header = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await firstValueFrom(
      this.httpService.get(this.REQUEST_USER_INFO_URL, header),
    );

    return SocialInfoDto.byKakao(response);
  }
}
