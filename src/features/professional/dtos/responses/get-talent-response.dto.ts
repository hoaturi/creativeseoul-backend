import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MemberLocationResponseDto } from '../../../common/dtos/member-location-response.dto';
import { MemberLanguageProficiencyResponseDto } from '../../../common/dtos/member-language-proficiency-response.dto';
import { TalentSocialLinksResponseDto } from './talent-social-links-response.dto';

export class GetTalentResponseDto {
  @ApiProperty()
  public readonly fullName: string;

  @ApiProperty()
  public readonly title: string;

  @ApiProperty()
  public readonly bio: string;

  @ApiPropertyOptional()
  public readonly avatarUrl?: string;

  @ApiProperty({
    type: MemberLocationResponseDto,
  })
  public readonly location: MemberLocationResponseDto;

  @ApiProperty({
    type: [MemberLanguageProficiencyResponseDto],
  })
  public readonly languages: MemberLanguageProficiencyResponseDto[];

  @ApiPropertyOptional({
    type: TalentSocialLinksResponseDto,
  })
  public readonly socialLinks?: TalentSocialLinksResponseDto;

  @ApiProperty()
  public readonly isAvailable: boolean;

  @ApiPropertyOptional()
  public readonly salaryRange?: string;

  @ApiPropertyOptional()
  public readonly hourlyRateRange?: string;

  @ApiProperty()
  public readonly locationTypes: string[];

  @ApiProperty()
  public readonly employmentTypes: string[];

  @ApiPropertyOptional()
  public readonly skills?: string[];

  @ApiPropertyOptional()
  public readonly email?: string;

  @ApiPropertyOptional()
  public readonly phone?: string;

  public constructor(data: {
    fullName: string;
    title: string;
    bio: string;
    avatarUrl?: string;
    location: MemberLocationResponseDto;
    languages: MemberLanguageProficiencyResponseDto[];
    socialLinks?: TalentSocialLinksResponseDto;
    isAvailable: boolean;
    salaryRange?: string;
    hourlyRateRange?: string;
    locationTypes: string[];
    employmentTypes: string[];
    skills?: string[];
    email?: string;
    phone?: string;
  }) {
    Object.assign(this, data);
  }
}
