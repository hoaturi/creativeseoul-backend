import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TalentSocialLinksDto } from './talent-social-links.dto';
import { MyTalentLanguageDto } from './my-talent-language.dto';

export class GetMyTalentResponseDto {
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

  @ApiProperty()
  public readonly countryId: number;

  @ApiPropertyOptional()
  public readonly city?: string;

  @ApiProperty({
    type: [MyTalentLanguageDto],
  })
  public readonly languages: MyTalentLanguageDto[];

  @ApiProperty({
    type: TalentSocialLinksDto,
  })
  public readonly socialLinks: TalentSocialLinksDto;

  @ApiProperty()
  public readonly availabilityStatusId: number;

  @ApiProperty()
  public readonly isContactable: boolean;

  @ApiProperty()
  public readonly requiresVisaSponsorship: boolean;

  @ApiPropertyOptional()
  public readonly experienceLevelId?: number;

  @ApiPropertyOptional()
  public readonly salaryRangeId?: number;

  @ApiPropertyOptional()
  public readonly hourlyRateRangeId?: number;

  @ApiProperty({ type: [Number] })
  public readonly workLocationTypeIds: number[];

  @ApiProperty({ type: [Number] })
  public readonly employmentTypeIds: number[];

  @ApiPropertyOptional()
  public readonly skills?: string[];

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
    countryId: number;
    city?: string;
    languages: MyTalentLanguageDto[];
    socialLinks: TalentSocialLinksDto;
    availabilityStatusId: number;
    isContactable: boolean;
    requiresVisaSponsorship: boolean;
    experienceLevelId?: number;
    salaryRangeId?: number;
    hourlyRateRangeId?: number;
    workLocationTypeIds: number[];
    employmentTypeIds: number[];
    skills?: string[];
    email?: string;
    phone?: string;
  }) {
    this.handle = data.handle;
    this.fullName = data.fullName;
    this.title = data.title;
    this.bio = data.bio;
    this.avatarUrl = data.avatarUrl;
    this.countryId = data.countryId;
    this.city = data.city;
    this.languages = data.languages;
    this.socialLinks = data.socialLinks;
    this.availabilityStatusId = data.availabilityStatusId;
    this.isContactable = data.isContactable;
    this.requiresVisaSponsorship = data.requiresVisaSponsorship;
    this.experienceLevelId = data.experienceLevelId;
    this.salaryRangeId = data.salaryRangeId;
    this.hourlyRateRangeId = data.hourlyRateRangeId;
    this.workLocationTypeIds = data.workLocationTypeIds;
    this.employmentTypeIds = data.employmentTypeIds;
    this.skills = data.skills;
    this.email = data.email;
    this.phone = data.phone;
  }
}
