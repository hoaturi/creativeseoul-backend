import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TalentLocationDto } from './talent-location.dto';
import { TalentLanguageProficiencyDto } from './talent-language-proficiency.dto';
import { TalentSocialLinksDto } from './talent-social-links.dto';
import { TalentSalaryRangeDto } from './talent-salary-range.dto';
import { TalentHourlyRateRangeDto } from './talent-hourly-rate-range.dto';
import { TalentWorkLocationTypeDto } from './talent-work-location-type.dto';
import { TalentEmploymentTypeDto } from './talent-employment-type.dto';

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
    type: TalentLocationDto,
  })
  public readonly location: TalentLocationDto;

  @ApiProperty({
    type: [TalentLanguageProficiencyDto],
  })
  public readonly languages: TalentLanguageProficiencyDto[];

  @ApiPropertyOptional({
    type: TalentSocialLinksDto,
  })
  public readonly socialLinks?: TalentSocialLinksDto;

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
    location: TalentLocationDto;
    languages: TalentLanguageProficiencyDto[];
    socialLinks?: TalentSocialLinksDto;
    isAvailable: boolean;
    salaryRange?: TalentSalaryRangeDto;
    hourlyRateRange?: TalentHourlyRateRangeDto;
    workLocationTypes: TalentWorkLocationTypeDto[];
    employmentTypes: TalentEmploymentTypeDto[];
    skills?: string[];
    email?: string;
    phone?: string;
  }) {
    Object.assign(this, data);
  }
}
