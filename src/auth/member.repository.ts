import { DataSource, Repository } from 'typeorm';
import { Member } from './member.entity';
import { Injectable } from '@nestjs/common';
import { SocialInfoDto } from './dto/social-info.dto';
import { RuntimeException } from '@nestjs/core/errors/exceptions';

@Injectable()
export class MemberRepository extends Repository<Member> {
  constructor(dataSource: DataSource) {
    super(Member, dataSource.createEntityManager());
  }

  async createMember(socialInfoDto: SocialInfoDto): Promise<Member> {
    const { socialType, socialId, name, profileImageUrl } = socialInfoDto;

    const member = {
      socialType: socialType,
      socialId: socialId,
      name: name,
      profileImageUrl: profileImageUrl,
    };

    console.log(member);

    return await this.save(member);

    // try {
    //   return await this.save(member);
    // } catch (error) {
    //   throw new RuntimeException('엔티티 생성 중 오류 발생');
    // }
  }
}
