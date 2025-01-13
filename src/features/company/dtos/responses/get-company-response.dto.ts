import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CompanySocialLinksResponseDto {
  @ApiPropertyOptional()
  public linkedin?: string;

  @ApiPropertyOptional()
  public twitter?: string;

  @ApiPropertyOptional()
  public instagram?: string;

  @ApiPropertyOptional()
  public youtube?: string;

  public constructor(data: CompanySocialLinksResponseDto) {
    this.linkedin = data.linkedin;
    this.twitter = data.twitter;
    this.instagram = data.instagram;
    this.youtube = data.youtube;
  }
}

export class CompanyJobItemResponseDto {
  public readonly id!: string;

  public readonly title!: string;

  public readonly location!: string;

  public readonly category!: string;

  public readonly employmentType!: string;

  public readonly minSalary?: number;

  public readonly maxSalary?: number;

  public readonly koreanLevel!: string;

  public readonly residentOnly!: boolean;

  public readonly tags?: string[];

  public readonly isFeatured!: boolean;

  public constructor(data: {
    id: string;
    title: string;
    location: string;
    category: string;
    employmentType: string;
    minSalary?: number;
    maxSalary?: number;
    koreanLevel: string;
    residentOnly: boolean;
    tags?: string[];
    isFeatured: boolean;
  }) {
    this.id = data.id;
    this.title = data.title;
    this.location = data.location;
    this.category = data.category;
    this.employmentType = data.employmentType;
    this.minSalary = data.minSalary;
    this.maxSalary = data.maxSalary;
    this.koreanLevel = data.koreanLevel;
    this.residentOnly = data.residentOnly;
    this.tags = data.tags;
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

  @ApiPropertyOptional()
  public location?: string;

  @ApiPropertyOptional()
  public size?: string;

  @ApiPropertyOptional({
    type: CompanySocialLinksResponseDto,
  })
  public socialLinks?: CompanySocialLinksResponseDto;

  @ApiProperty({
    type: [CompanyJobItemResponseDto],
  })
  public jobs: CompanyJobItemResponseDto[];

  public constructor(data: {
    name: string;
    summary: string;
    description: string;
    logoUrl?: string;
    websiteUrl: string;
    location?: string;
    size?: string;
    socialLinks?: CompanySocialLinksResponseDto;
    jobs: CompanyJobItemResponseDto[];
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
