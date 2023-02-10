import { SocialType } from '../social.type';

export class SocialInfoDto {
  socialType: SocialType;
  socialId: string;
  name: string;
  profileImageUrl: string | null;

  private constructor(
    socialType: SocialType,
    socialId: string,
    name: string,
    profileImageUrl: string | null,
  ) {
    this.socialType = socialType;
    this.socialId = socialId;
    this.name = name;
    this.profileImageUrl = profileImageUrl;
  }

  static byKakao(httpResponse) {
    const socialId = httpResponse.data.id;
    const name = httpResponse.data.kakao_account.profile.nickname;
    const profileImageUrl =
      httpResponse.data.kakao_account.profile.profile_image_url;

    return new SocialInfoDto(SocialType.KAKAO, socialId, name, profileImageUrl);
  }

  static byGitHub(httpResponse) {
    const socialId = httpResponse.data.id;
    const name = httpResponse.data.name;
    const profileImageUrl = httpResponse.data.avatar_url;

    return new SocialInfoDto(
      SocialType.GITHUB,
      socialId,
      name,
      profileImageUrl,
    );
  }
}
