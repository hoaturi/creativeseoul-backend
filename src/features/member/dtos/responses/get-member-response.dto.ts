import { LanguageWithLevelDto } from '../../../common/dtos/language-with-level.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LocationDto } from '../../../common/dtos/location.dto';
import { SocialLinksResponseDto } from './social-links-response.dto';

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

  public constructor(data: {
    handle: string;
    fullName?: string;
    title?: string;
    bio?: string;
    avatarUrl?: string;
    tags?: string[];
    languages: LanguageWithLevelDto[];
    location: LocationDto;
    socialLinks?: SocialLinksResponseDto;
  }) {
    Object.assign(this, data);
  }
}
