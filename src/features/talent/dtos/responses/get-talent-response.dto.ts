import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TalentLocationResponseDto } from './talent-location-response.dto';
import { TalentLanguageProficiencyResponseDto } from './talent-language-proficiency-response.dto';
import { TalentSocialLinksResponseDto } from './talent-social-links-response.dto';
import { TalentSalaryRangeResponseDto } from './talent-salary-range-response.dto';
import { TalentHourlyRateRangeResponseDto } from './talent-hourly-rate-range-response.dto';
import { TalentWorkLocationTypeResponseDto } from './talent-work-location-type-response.dto';
import { TalentEmploymentTypeResponseDto } from './talent-employment-type-response.dto';

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
    type: TalentLocationResponseDto,
  })
  public readonly location: TalentLocationResponseDto;

  @ApiProperty({
    type: [TalentLanguageProficiencyResponseDto],
  })
  public readonly languages: TalentLanguageProficiencyResponseDto[];

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
    location: TalentLocationResponseDto;
    languages: TalentLanguageProficiencyResponseDto[];
    socialLinks?: TalentSocialLinksResponseDto;
    isAvailable: boolean;
    salaryRange?: TalentSalaryRangeResponseDto;
    hourlyRateRange?: TalentHourlyRateRangeResponseDto;
    workLocationTypes: TalentWorkLocationTypeResponseDto[];
    employmentTypes: TalentEmploymentTypeResponseDto[];
    skills?: string[];
    email?: string;
    phone?: string;
  }) {
    Object.assign(this, data);
  }
}
