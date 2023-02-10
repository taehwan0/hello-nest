import { Injectable } from '@nestjs/common';
import { KakaoClient } from './kakao.client';
import { GithubClient } from './github.client';
import { SocialType } from './social.type';
import { RuntimeException } from '@nestjs/core/errors/exceptions';
import { OauthClient } from './oauth.client';

@Injectable()
export class OauthFactory {
  constructor(
    private readonly kakaoClient: KakaoClient,
    private readonly githubClient: GithubClient,
  ) {}

  getClient(socialType: SocialType): OauthClient {
    if (socialType === SocialType.GITHUB) {
      return this.githubClient;
    }
    if (socialType === SocialType.KAKAO) {
      return this.kakaoClient;
    }
    throw new RuntimeException('정의되지 않은 SocialType');
  }
}
