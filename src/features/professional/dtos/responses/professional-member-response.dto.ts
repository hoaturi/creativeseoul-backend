import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MemberLocationResponseDto } from '../../../common/dtos/member-location-response.dto';
import { MemberLanguageProficiencyResponseDto } from '../../../common/dtos/member-language-proficiency-response.dto';
import { MemberSocialLinksResponseDto } from '../../../member/dtos/responses/member-social-links-response.dto';

export class ProfessionalMemberResponseDto {
  @ApiProperty()
  public readonly handle: string;

  @ApiProperty()
  public readonly fullName: string;

  @ApiProperty()
  public readonly title: string;

  @ApiProperty()
  public readonly bio: string;

  @ApiPropertyOptional()
  public readonly avatarUrl: string;

  @ApiPropertyOptional()
  public readonly tags: string[];

  @ApiProperty({
    type: MemberLocationResponseDto,
  })
  public readonly location: MemberLocationResponseDto;

  @ApiProperty({
    type: [MemberLanguageProficiencyResponseDto],
  })
  public readonly languages: MemberLanguageProficiencyResponseDto[];

  @ApiProperty({
    type: MemberSocialLinksResponseDto,
  })
  public readonly socialLinks: MemberSocialLinksResponseDto;

  public constructor(data: {
    handle: string;
    fullName: string;
    title: string;
    bio: string;
    avatarUrl?: string;
    tags?: string[];
    location: MemberLocationResponseDto;
    languages: MemberLanguageProficiencyResponseDto[];
    socialLinks: MemberSocialLinksResponseDto;
  }) {
    Object.assign(this, data);
  }
}
