import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TalentLocationResponseDto } from './talent-location-response.dto';
import { TalentLanguageProficiencyResponseDto } from './talent-language-proficiency-response.dto';
import { TalentSocialLinksResponseDto } from './talent-social-links-response.dto';

export class GetTalentAsMemberResponseDto {
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

  @ApiProperty({ type: TalentLocationResponseDto })
  public readonly location: TalentLocationResponseDto;

  @ApiProperty({ type: TalentLanguageProficiencyResponseDto })
  public readonly languages: TalentLanguageProficiencyResponseDto[];

  @ApiPropertyOptional({ type: TalentSocialLinksResponseDto })
  public readonly socialLinks?: TalentSocialLinksResponseDto;

  public constructor(
    handle: string,
    fullName: string,
    title: string,
    bio: string,
    location: TalentLocationResponseDto,
    languages: TalentLanguageProficiencyResponseDto[],
    avatarUrl?: string,
    socialLinks?: TalentSocialLinksResponseDto,
  ) {
    this.handle = handle;
    this.fullName = fullName;
    this.title = title;
    this.bio = bio;
    this.location = location;
    this.languages = languages;
    this.avatarUrl = avatarUrl;
    this.socialLinks = socialLinks;
  }
}
