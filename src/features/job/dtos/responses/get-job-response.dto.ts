import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RelatedJobDto {
  @ApiProperty()
  public readonly slug: string;

  @ApiProperty()
  public readonly title: string;

  @ApiProperty()
  public readonly employmentType: string;

  @ApiProperty()
  public readonly location: string;

  public constructor(data: {
    slug: string;
    title: string;
    employmentType: string;
    location: string;
  }) {
    this.slug = data.slug;
    this.title = data.title;
    this.employmentType = data.employmentType;
    this.location = data.location;
  }
}

export class JobCompanyDto {
  @ApiProperty()
  public readonly slug: string;

  @ApiProperty()
  public readonly name: string;

  @ApiProperty()
  public readonly description: string;

  @ApiPropertyOptional()
  public readonly logoUrl?: string;

  @ApiPropertyOptional()
  public readonly size?: string;

  @ApiProperty()
  public readonly relatedJobs: RelatedJobDto[];

  public constructor(data: {
    slug: string;
    name: string;
    description: string;
    logoUrl?: string;
    size?: string;
    relatedJobs: RelatedJobDto[];
  }) {
    this.slug = data.slug;
    this.name = data.name;
    this.description = data.description;
    this.logoUrl = data.logoUrl;
    this.size = data.size;
    this.relatedJobs = data.relatedJobs;
  }
}

export class GetJobResponseDto {
  @ApiProperty({ type: JobCompanyDto })
  public readonly company: JobCompanyDto;

  @ApiProperty()
  public readonly id: string;

  @ApiProperty()
  public readonly title: string;

  @ApiProperty()
  public readonly description: string;

  @ApiProperty()
  public readonly category: string;

  @ApiProperty()
  public readonly employmentType: string;

  @ApiProperty()
  public readonly experienceLevel: string;

  @ApiProperty()
  public readonly workLocationType: string;

  @ApiProperty()
  public readonly location: string;

  @ApiPropertyOptional()
  public readonly minSalary?: number;

  @ApiPropertyOptional()
  public readonly maxSalary?: number;

  @ApiPropertyOptional()
  public readonly tags?: string[];

  @ApiProperty()
  public readonly koreanLevel: string;

  @ApiProperty()
  public readonly englishLevel: string;

  @ApiProperty()
  public readonly residentOnly: boolean;

  @ApiProperty()
  public readonly applicationUrl: string;

  public constructor(data: {
    company: JobCompanyDto;
    id: string;
    title: string;
    description: string;
    category: string;
    employmentType: string;
    experienceLevel: string;
    workLocationType: string;
    location: string;
    minSalary?: number;
    maxSalary?: number;
    tags?: string[];
    koreanLevel: string;
    englishLevel: string;
    residentOnly: boolean;
    applicationUrl: string;
  }) {
    this.id = data.id;
    this.company = data.company;
    this.title = data.title;
    this.description = data.description;
    this.category = data.category;
    this.employmentType = data.employmentType;
    this.experienceLevel = data.experienceLevel;
    this.workLocationType = data.workLocationType;
    this.location = data.location;
    this.minSalary = data.minSalary;
    this.maxSalary = data.maxSalary;
    this.tags = data.tags;
    this.koreanLevel = data.koreanLevel;
    this.englishLevel = data.englishLevel;
    this.residentOnly = data.residentOnly;
    this.applicationUrl = data.applicationUrl;
  }
}
