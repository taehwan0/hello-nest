import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRepository } from './user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UserRepository],
  imports: [TypeOrmModule.forFeature([User])],
})
export class AuthModule {}
