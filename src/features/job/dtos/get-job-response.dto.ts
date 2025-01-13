import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class JobCompanyDto {
  @ApiProperty()
  public readonly id: string;

  @ApiProperty()
  public readonly name: string;

  @ApiProperty()
  public readonly description: string;

  @ApiProperty()
  public readonly logoUrl: string;

  @ApiProperty()
  public readonly size: string;

  public constructor(data: {
    id: string;
    name: string;
    logoUrl: string;
    size: string;
  }) {
    this.id = data.id;
    this.name = data.name;
    this.logoUrl = data.logoUrl;
    this.size = data.size;
  }
}

export class GetJobResponseDto {
  @ApiProperty({ type: JobCompanyDto })
  public readonly company: JobCompanyDto;

  @ApiProperty()
  public readonly title: string;

  @ApiProperty()
  public readonly description: string;

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
  public readonly englishLevel: string;

  @ApiProperty()
  public readonly residentOnly: boolean;

  @ApiProperty()
  public readonly applicationUrl: string;

  public constructor(data: {
    company: JobCompanyDto;
    title: string;
    description: string;
    category: string;
    employmentType: string;
    seniorityLevel: string;
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
    this.company = data.company;
    this.title = data.title;
    this.description = data.description;
    this.category = data.category;
    this.employmentType = data.employmentType;
    this.seniorityLevel = data.seniorityLevel;
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
