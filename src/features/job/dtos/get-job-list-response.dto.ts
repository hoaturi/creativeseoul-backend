import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GetJobListItemCompanyDto {
  @ApiProperty()
  public readonly id: string;

  @ApiProperty()
  public readonly name: string;

  @ApiPropertyOptional()
  public readonly logoUrl?: string;

  public constructor(data: { id: string; name: string; logoUrl?: string }) {
    this.id = data.id;
    this.name = data.name;
    this.logoUrl = data.logoUrl;
  }
}

export class GetJobListItemDto {
  @ApiProperty({
    type: GetJobListItemCompanyDto,
  })
  public readonly company: GetJobListItemCompanyDto;

  @ApiProperty()
  public readonly slug: string;

  @ApiProperty()
  public readonly title: string;

  @ApiProperty()
  public readonly category: string;

  @ApiProperty()
  public readonly employmentType: string;

  @ApiProperty()
  public readonly seniorityLevel: string;

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
  public readonly residentOnly: boolean;

  @ApiProperty()
  public readonly isFeatured: boolean;

  public constructor(data: {
    company: GetJobListItemCompanyDto;
    slug: string;
    title: string;
    category: string;
    employmentType: string;
    seniorityLevel: string;
    workLocationType: string;
    location: string;
    minSalary?: number;
    maxSalary?: number;
    tags?: string[];
    koreanLevel: string;
    residentOnly: boolean;
    isFeatured: boolean;
  }) {
    this.company = data.company;
    this.slug = data.slug;
    this.title = data.title;
    this.category = data.category;
    this.employmentType = data.employmentType;
    this.seniorityLevel = data.seniorityLevel;
    this.workLocationType = data.workLocationType;
    this.location = data.location;
    this.minSalary = data.minSalary;
    this.maxSalary = data.maxSalary;
    this.tags = data.tags;
    this.koreanLevel = data.koreanLevel;
    this.residentOnly = data.residentOnly;
    this.isFeatured = data.isFeatured;
  }
}

export class GetJobListResponseDto {
  @ApiProperty({ type: [GetJobListItemDto] })
  public readonly jobs: GetJobListItemDto[];

  @ApiProperty()
  public readonly total: number;

  public constructor(jobs: GetJobListItemDto[], total: number) {
    this.jobs = jobs;
    this.total = total;
  }
}
