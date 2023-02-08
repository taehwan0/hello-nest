import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { MemberRepository } from './member.repository';
import { Member } from './member.entity';
import { SocialInfoDto } from './dto/social-info.dto';
import { OauthFactory } from './oauth.factory';
import { SocialType } from './social.type';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private memberRepository: MemberRepository,
    private jwtService: JwtService,
    private oauthFactory: OauthFactory,
  ) {}

  async signUp(authCredentialDto: AuthCredentialDto): Promise<void> {
    return await this.userRepository.createUser(authCredentialDto);
  }

  async signIn(
    authCredentialDto: AuthCredentialDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialDto;

    const user = await this.userRepository.findOne({ where: { username } });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = {
        id: user.id,
        username: username,
      };

      const accessToken = this.jwtService.sign(payload);

      return { accessToken: accessToken };
    }
    throw new UnauthorizedException('login failed');
  }

  async loginKakao(code: string): Promise<Member> {
    const accessToken = await this.oauthFactory.getAccessToken(
      SocialType.KAKAO,
      code,
    );
    const socialInfo = await this.oauthFactory.getSocialInfo(
      SocialType.KAKAO,
      accessToken,
    );

    return await this.signUpAndIn(socialInfo);
  }

  async loginGithub(code: string): Promise<any> {
    const accessToken = await this.oauthFactory.getAccessToken(
      SocialType.GITHUB,
      code,
    );
    const socialInfo = await this.oauthFactory.getSocialInfo(
      SocialType.GITHUB,
      accessToken,
    );

    return await this.signUpAndIn(socialInfo);
  }

  async signUpAndIn(socialInfo: SocialInfoDto): Promise<Member> {
    const member = await this.memberRepository.findOneBy({
      socialType: socialInfo.socialType,
      socialId: socialInfo.socialId,
    });

    if (member) {
      return member;
    } else {
      return await this.memberRepository.createMember(socialInfo);
    }
  }
}
