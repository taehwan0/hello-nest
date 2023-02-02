import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { KakaoClient } from './kakao.client';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private kakaoClient: KakaoClient,
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

  async loginKakao(code: string): Promise<string> {
    return this.kakaoClient.getAccessToken(code);
  }
}
