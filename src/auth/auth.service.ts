import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { KakaoClient } from './kakao.client';
import { MemberRepository } from './member.repository';
import { Member } from './member.entity';
import { GithubClient } from './github.client';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private memberRepository: MemberRepository,
    private jwtService: JwtService,
    private kakaoClient: KakaoClient,
    private githubClient: GithubClient,
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
    const accessToken = await this.kakaoClient.getAccessToken(code);
    const socialInfo = await this.kakaoClient.getSocialInfo(accessToken);

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

  async loginGithub(code: string): Promise<any> {
    return await this.githubClient.getAccessToken(code);
  }
}
