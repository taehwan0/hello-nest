import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { SocialType } from './social.type';
import { SocialInfoDto } from './dto/social-info.dto';

@Entity()
export class Member extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  socialType: SocialType;

  @Column()
  socialId: string;

  @Column()
  profileImageUrl: string | null;
}
