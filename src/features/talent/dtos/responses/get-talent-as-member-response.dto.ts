import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TalentLocationDto } from './talent-location.dto';
import { TalentLanguageProficiencyDto } from './talent-language-proficiency.dto';
import { TalentSocialLinksDto } from './talent-social-links.dto';

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

  @ApiProperty({ type: TalentLocationDto })
  public readonly location: TalentLocationDto;

  @ApiProperty({ type: TalentLanguageProficiencyDto })
  public readonly languages: TalentLanguageProficiencyDto[];

  @ApiPropertyOptional({ type: TalentSocialLinksDto })
  public readonly socialLinks?: TalentSocialLinksDto;

  public constructor(
    handle: string,
    fullName: string,
    title: string,
    bio: string,
    location: TalentLocationDto,
    languages: TalentLanguageProficiencyDto[],
    avatarUrl?: string,
    socialLinks?: TalentSocialLinksDto,
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
