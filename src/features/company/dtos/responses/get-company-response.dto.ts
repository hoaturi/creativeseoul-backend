import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CompanySocialLinksDto } from './company-social-links.dto';

export class CompanyJobItemDto {
  @ApiProperty()
  public readonly slug!: string;

  @ApiProperty()
  public readonly title!: string;

  @ApiProperty()
  public readonly location!: string;

  @ApiProperty()
  public readonly category!: string;

  @ApiProperty()
  public readonly employmentType!: string;

  @ApiProperty()
  public readonly workLocationType!: string;

  @ApiProperty()
  public readonly experienceLevel!: string;

  @ApiProperty()
  public readonly minSalary?: number;

  @ApiProperty()
  public readonly maxSalary?: number;

  @ApiProperty()
  public readonly koreanLevel!: string;

  @ApiProperty()
  public readonly residentOnly!: boolean;

  @ApiProperty()
  public readonly isFeatured!: boolean;

  public constructor(data: {
    slug: string;
    title: string;
    location: string;
    category: string;
    employmentType: string;
    workLocationType: string;
    experienceLevel: string;
    minSalary?: number;
    maxSalary?: number;
    koreanLevel: string;
    residentOnly: boolean;
    tags?: string[];
    isFeatured: boolean;
  }) {
    this.slug = data.slug;
    this.title = data.title;
    this.location = data.location;
    this.category = data.category;
    this.employmentType = data.employmentType;
    this.workLocationType = data.workLocationType;
    this.experienceLevel = data.experienceLevel;
    this.minSalary = data.minSalary;
    this.maxSalary = data.maxSalary;
    this.koreanLevel = data.koreanLevel;
    this.residentOnly = data.residentOnly;
    this.isFeatured = data.isFeatured;
  }
}

export class GetCompanyResponseDto {
  @ApiProperty()
  public name: string;

  @ApiProperty()
  public summary: string;

  @ApiProperty()
  public description: string;

  @ApiPropertyOptional()
  public logoUrl?: string;

  @ApiProperty()
  public websiteUrl: string;

  @ApiProperty()
  public location: string;

  @ApiProperty()
  public size: string;

  @ApiProperty({
    type: CompanySocialLinksDto,
  })
  public socialLinks: CompanySocialLinksDto;

  @ApiProperty({
    type: [CompanyJobItemDto],
  })
  public jobs: CompanyJobItemDto[];

  public constructor(data: {
    name: string;
    summary: string;
    description: string;
    logoUrl?: string;
    websiteUrl: string;
    location: string;
    size: string;
    socialLinks: CompanySocialLinksDto;
    jobs: CompanyJobItemDto[];
  }) {
    this.name = data.name;
    this.summary = data.summary;
    this.description = data.description;
    this.logoUrl = data.logoUrl;
    this.websiteUrl = data.websiteUrl;
    this.location = data.location;
    this.size = data.size;
    this.socialLinks = data.socialLinks;
    this.jobs = data.jobs;
  }
}
