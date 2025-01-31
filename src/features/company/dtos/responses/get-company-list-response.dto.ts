import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CompanyListItemDto {
  @ApiProperty()
  public readonly slug: string;

  @ApiProperty()
  public readonly name: string;

  @ApiProperty()
  public readonly summary: string;

  @ApiProperty()
  public readonly size: string;

  @ApiPropertyOptional()
  public readonly logoUrl?: string;

  @ApiPropertyOptional()
  public readonly location?: string;

  @ApiProperty()
  public readonly totalJobs: number;

  @ApiProperty()
  public readonly isSponsor: boolean;

  public constructor(data: {
    slug: string;
    name: string;
    summary: string;
    size: string;
    logoUrl?: string;
    location?: string;
    totalJobs: number;
    isSponsor: boolean;
  }) {
    this.slug = data.slug;
    this.name = data.name;
    this.summary = data.summary;
    this.size = data.size;
    this.logoUrl = data.logoUrl;
    this.location = data.location;
    this.totalJobs = data.totalJobs;
    this.isSponsor = data.isSponsor;
  }
}

export class GetCompanyListResponseDto {
  @ApiProperty({ type: [CompanyListItemDto] })
  public readonly companies: CompanyListItemDto[];

  public constructor(companies: CompanyListItemDto[]) {
    this.companies = companies;
  }
}
