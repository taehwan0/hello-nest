import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { SocialInfoDto } from './dto/social-info.dto';
import { OauthClient } from './oauth.client';

@Injectable()
export class KakaoClient implements OauthClient {
  private REQUEST_TOKEN_URL = 'https://kauth.kakao.com/oauth/token';
  private REQUEST_USER_INFO_URL = 'https://kapi.kakao.com/v2/user/me';

  private APP_KEY = this.configService.get('KAKAO_APP_KEY');
  private REDIRECT_URL = this.configService.get('KAKAO_REDIRECT_URL');
  private CLIENT_SECRET = this.configService.get('KAKAO_CLIENT_SECRET');

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async getAccessToken(code: string): Promise<string> {
    const body = {
      grant_type: 'authorization_code',
      client_id: this.APP_KEY,
      redirect_url: this.REDIRECT_URL,
      client_secret: this.CLIENT_SECRET,
      code: code,
    };

    const header = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
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
