import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TalentLocationDto } from './talent-location.dto';
import { TalentLanguageDto } from './talent-language.dto';
import { TalentSocialLinksDto } from './talent-social-links.dto';
import { TalentWorkLocationTypeDto } from './talent-work-location-type.dto';
import { TalentEmploymentTypeDto } from './talent-employment-type.dto';

export class GetTalentResponseDto {
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

  @ApiProperty({
    type: TalentLocationDto,
  })
  public readonly location: TalentLocationDto;

  @ApiProperty({
    type: [TalentLanguageDto],
  })
  public readonly languages: TalentLanguageDto[];

  @ApiPropertyOptional({
    type: TalentSocialLinksDto,
  })
  public readonly socialLinks?: TalentSocialLinksDto;

  @ApiProperty()
  public readonly availabilityStatus: string;

  @ApiPropertyOptional()
  public readonly salaryRange?: string;

  @ApiPropertyOptional()
  public readonly hourlyRateRange?: string;

  @ApiPropertyOptional()
  public readonly experienceLevel?: string;

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

  @ApiProperty()
  public readonly isContactable: boolean;

  @ApiPropertyOptional()
  public readonly email?: string;

  @ApiPropertyOptional()
  public readonly phone?: string;

  public constructor(data: {
    handle: string;
    fullName: string;
    title: string;
    bio: string;
    avatarUrl?: string;
    location: TalentLocationDto;
    languages: TalentLanguageDto[];
    socialLinks?: TalentSocialLinksDto;
    availabilityStatus: string;
    salaryRange?: string;
    hourlyRateRange?: string;
    experienceLevel?: string;
    workLocationTypes: TalentWorkLocationTypeDto[];
    employmentTypes: TalentEmploymentTypeDto[];
    skills?: string[];
    isContactable: boolean;
    email?: string;
    phone?: string;
  }) {
    this.handle = data.handle;
    this.fullName = data.fullName;
    this.title = data.title;
    this.bio = data.bio;
    this.avatarUrl = data.avatarUrl;
    this.location = data.location;
    this.languages = data.languages;
    this.socialLinks = data.socialLinks;
    this.availabilityStatus = data.availabilityStatus;
    this.salaryRange = data.salaryRange;
    this.experienceLevel = data.experienceLevel;
    this.hourlyRateRange = data.hourlyRateRange;
    this.workLocationTypes = data.workLocationTypes;
    this.employmentTypes = data.employmentTypes;
    this.skills = data.skills;
    this.isContactable = data.isContactable;
    this.email = data.email;
    this.phone = data.phone;
  }
}
