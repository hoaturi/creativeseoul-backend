import { LanguageProficiencyResponseDto } from '../../../common/dtos/language-proficiency-response.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LocationResponseDto } from '../../../common/dtos/location-response.dto';
import { SocialLinksResponseDto } from './social-links-response.dto';

export class GetMemberResponseDto {
  @ApiProperty()
  public readonly handle: string;

  @ApiProperty()
  public readonly fullName: string;

  @ApiProperty()
  public readonly title: string;

  @ApiProperty()
  public readonly bio: string;

  @ApiProperty()
  public readonly avatarUrl?: string;

  @ApiProperty()
  public readonly tags?: string[];

  @ApiProperty()
  public readonly isOpenToWork?: boolean;

  @ApiProperty()
  public readonly languages: LanguageProficiencyResponseDto[];

  @ApiProperty()
  public readonly location: LocationResponseDto;

  @ApiPropertyOptional()
  public readonly socialLinks?: SocialLinksResponseDto;

  public constructor(data: {
    handle: string;
    fullName?: string;
    title: string;
    bio: string;
    avatarUrl?: string;
    tags: string[];
    isOpenToWork?: boolean;
    languages: LanguageProficiencyResponseDto[];
    location: LocationResponseDto;
    socialLinks?: SocialLinksResponseDto;
  }) {
    Object.assign(this, data);
  }
}
