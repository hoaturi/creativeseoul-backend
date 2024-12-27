import { MemberLanguageProficiencyResponseDto } from '../../../common/dtos/member-language-proficiency-response.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MemberLocationResponseDto } from '../../../common/dtos/member-location-response.dto';
import { MemberSocialLinksResponseDto } from './member-social-links-response.dto';

export class GetMemberResponseDto {
  @ApiProperty()
  public readonly handle: string;

  @ApiProperty()
  public readonly fullName: string;

  @ApiProperty()
  public readonly title: string;

  @ApiProperty()
  public readonly bio: string;

  @ApiPropertyOptional()
  public readonly avatarUrl?: string;

  @ApiPropertyOptional()
  public readonly tags?: string[];

  @ApiPropertyOptional()
  public readonly isOpenToWork?: boolean;

  @ApiProperty()
  public readonly languages: MemberLanguageProficiencyResponseDto[];

  @ApiProperty()
  public readonly location: MemberLocationResponseDto;

  @ApiPropertyOptional()
  public readonly socialLinks?: MemberSocialLinksResponseDto;

  public constructor(data: {
    handle: string;
    fullName: string;
    title: string;
    bio: string;
    avatarUrl?: string;
    tags?: string[];
    isOpenToWork?: boolean;
    languages: MemberLanguageProficiencyResponseDto[];
    location: MemberLocationResponseDto;
    socialLinks?: MemberSocialLinksResponseDto;
  }) {
    Object.assign(this, data);
  }
}
