import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TalentLocationDto } from './talent-location.dto';
import { TalentLanguageProficiencyDto } from './talent-language-proficiency.dto';
import { TalentSocialLinksDto } from './talent-social-links.dto';
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

  @ApiProperty({
    type: [TalentWorkLocationTypeDto],
  })
  public readonly workLocationTypes: TalentWorkLocationTypeDto[];

  @ApiProperty({
    type: [TalentEmploymentTypeDto],
  })
  public readonly employmentTypes: TalentEmploymentTypeDto[];

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
    salaryRange?: string;
    hourlyRateRange?: string;
    workLocationTypes: TalentWorkLocationTypeDto[];
    employmentTypes: TalentEmploymentTypeDto[];
    skills?: string[];
    email?: string;
    phone?: string;
  }) {
    this.fullName = data.fullName;
    this.title = data.title;
    this.bio = data.bio;
    this.avatarUrl = data.avatarUrl;
    this.location = data.location;
    this.languages = data.languages;
    this.socialLinks = data.socialLinks;
    this.isAvailable = data.isAvailable;
    this.salaryRange = data.salaryRange;
    this.hourlyRateRange = data.hourlyRateRange;
    this.workLocationTypes = data.workLocationTypes;
    this.employmentTypes = data.employmentTypes;
    this.skills = data.skills;
    this.email = data.email;
    this.phone = data.phone;
  }
}
