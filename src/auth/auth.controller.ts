import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from './user.entity';
import { GetUser } from './get-user.decorator';
import { Member } from './member.entity';
import { SocialType } from './social.type';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(
    @Body(ValidationPipe) authCredentialDto: AuthCredentialDto,
  ): Promise<void> {
    return await this.authService.signUp(authCredentialDto);
  }

  @Post('/signin')
  async signIn(
    @Body(ValidationPipe) authCredentialDto: AuthCredentialDto,
  ): Promise<{ accessToken: string }> {
    return await this.authService.signIn(authCredentialDto);
  }

  @Post('/test')
  @UseGuards(AuthGuard())
  test(@GetUser() user: User) {
    console.log('user: ', user);
  }

  @Get('/kakao/login')
  async kakaoLogin(@Query('code') code: string): Promise<Member> {
    return await this.authService.login(SocialType.KAKAO, code);
  }

  @Get('/github/login')
  async githubLogin(@Query('code') code: string): Promise<Member> {
    return await this.authService.login(SocialType.GITHUB, code);
  }
}
