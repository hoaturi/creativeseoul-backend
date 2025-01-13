import { ApiProperty } from '@nestjs/swagger';

export class GetJobListItemCompanyDto {
  @ApiProperty()
  public readonly id: string;

  @ApiProperty()
  public readonly name: string;

  @ApiProperty()
  public readonly logoUrl: string;

  public constructor(data: { id: string; name: string; logoUrl: string }) {
    this.id = data.id;
    this.name = data.name;
    this.logoUrl = data.logoUrl;
  }
}

export class GetJobListItemDto {
  @ApiProperty()
  public readonly id: string;

  @ApiProperty({
    type: GetJobListItemCompanyDto,
  })
  public readonly company: GetJobListItemCompanyDto;

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

  @ApiProperty()
  public readonly minSalary: number;

  @ApiProperty()
  public readonly maxSalary: number;

  @ApiProperty()
  public readonly tags: string[];

  @ApiProperty()
  public readonly koreanLevel: string;

  @ApiProperty()
  public readonly residentOnly: boolean;

  @ApiProperty()
  public readonly isFeatured: boolean;

  public constructor(data: {
    id: string;
    company: GetJobListItemCompanyDto;
    title: string;
    category: string;
    employmentType: string;
    seniorityLevel: string;
    workLocationType: string;
    location: string;
    minSalary: number;
    maxSalary: number;
    tags: string[];
    koreanLevel: string;
    residentOnly: boolean;
    isFeatured: boolean;
  }) {
    this.id = data.id;
    this.company = data.company;
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
