import { LanguageWithLevelDto } from '../../common/dtos/language-with-level.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LocationDto } from '../../common/dtos/location.dto';
import { SocialLinksResponseDto } from './social-links-response.dto';
import { Member } from '../../../domain/member/member.entity';

export class GetMemberResponseDto {
  @ApiProperty()
  public readonly handle: string;

  @ApiProperty()
  public readonly fullName?: string;

  @ApiProperty()
  public readonly title?: string;

  @ApiProperty()
  public readonly bio?: string;

  @ApiProperty()
  public readonly avatarUrl?: string;

  @ApiProperty()
  public readonly tags?: string[];

  @ApiProperty()
  public readonly languages: LanguageWithLevelDto[];

  @ApiProperty()
  public readonly location: LocationDto;

  @ApiPropertyOptional()
  public readonly socialLinks?: SocialLinksResponseDto;

  public constructor(member: Member) {
    const languages = member.languages.getItems().map((lang) => {
      return new LanguageWithLevelDto(lang.language.name, lang.level);
    });
    const location = new LocationDto(member.country.name, member.city?.name);
    const socialLinks = member.socialLinks
      ? new SocialLinksResponseDto(member.socialLinks)
      : undefined;

    this.handle = member.handle;
    this.fullName = member.fullName;
    this.title = member.title;
    this.bio = member.bio;
    this.avatarUrl = member.avatarUrl;
    this.tags = member.tags;
    this.languages = languages;
    this.location = location;
    this.socialLinks = socialLinks;
  }
}
