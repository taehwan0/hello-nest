import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRepository } from './user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import * as config from 'config';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { KakaoClient } from './kakao.client';
import { MemberRepository } from './member.repository';
import { Member } from './member.entity';
import { GithubClient } from './github.client';
import { OauthFactory } from './oauth.factory';

const jwtConfig = config.get('jwt');

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    UserRepository,
    MemberRepository,
    JwtStrategy,
    OauthFactory,
    KakaoClient,
    GithubClient,
  ],
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || jwtConfig.secret,
      signOptions: {
        expiresIn: jwtConfig.expiresIn,
      },
    }),
    TypeOrmModule.forFeature([User, Member]),
    ConfigModule.forRoot(),
    HttpModule,
  ],
  exports: [PassportModule, JwtStrategy],
})
export class AuthModule {}
