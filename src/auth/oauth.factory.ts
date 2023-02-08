import { Injectable } from '@nestjs/common';
import { KakaoClient } from './kakao.client';
import { GithubClient } from './github.client';
import { SocialType } from './social.type';
import { RuntimeException } from '@nestjs/core/errors/exceptions';
import { SocialInfoDto } from './dto/social-info.dto';

@Injectable()
export class OauthFactory {
  constructor(
    private readonly kakaoClient: KakaoClient,
    private readonly githubClient: GithubClient,
  ) {}

  async getAccessToken(socialType: SocialType, code: string): Promise<string> {
    if (socialType === SocialType.GITHUB) {
      return await this.githubClient.getAccessToken(code);
    }
    if (socialType === SocialType.KAKAO) {
      return await this.kakaoClient.getAccessToken(code);
    }
    throw new RuntimeException('정의되지 않은 SocialType');
  }

  async getSocialInfo(
    socialType: SocialType,
    accessToken: string,
  ): Promise<SocialInfoDto> {
    if (socialType === SocialType.GITHUB) {
      return await this.githubClient.getSocialInfo(accessToken);
    }
    if (socialType === SocialType.KAKAO) {
      return await this.kakaoClient.getSocialInfo(accessToken);
    }
    throw new RuntimeException('정의되지 않은 SocialType');
  }
}
