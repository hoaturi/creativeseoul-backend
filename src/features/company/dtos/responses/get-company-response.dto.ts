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

  public readonly salaryType!: string;

  public readonly requiredKoreanLevel!: string;

  public readonly requiresKoreanResidency!: boolean;

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
    salaryType: string;
    requiredKoreanLevel: string;
    requiresKoreanResidency: boolean;
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
    this.salaryType = data.salaryType;
    this.requiredKoreanLevel = data.requiredKoreanLevel;
    this.requiresKoreanResidency = data.requiresKoreanResidency;
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
  public languages?: string[];

  @ApiPropertyOptional()
  public logoUrl?: string;

  @ApiProperty()
  public websiteUrl: string;

  @ApiPropertyOptional()
  public location?: string;

  @ApiPropertyOptional()
  public size?: string;

  @ApiPropertyOptional()
  public socialLinks?: CompanySocialLinksResponseDto;

  @ApiProperty()
  public jobs: CompanyJobItemResponseDto[];

  public constructor(data: {
    name: string;
    summary: string;
    description: string;
    languages?: string[];
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
    this.languages = data.languages;
    this.logoUrl = data.logoUrl;
    this.websiteUrl = data.websiteUrl;
    this.location = data.location;
    this.size = data.size;
    this.socialLinks = data.socialLinks;
    this.jobs = data.jobs;
  }
}
