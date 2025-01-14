import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CompanyListItemDto {
  @ApiProperty()
  public readonly id: string;

  @ApiProperty()
  public readonly name: string;

  @ApiProperty()
  public readonly summary: string;

  @ApiPropertyOptional()
  public readonly logoUrl?: string;

  @ApiProperty()
  public readonly totalJobs: number;

  public constructor(data: {
    id: string;
    name: string;
    summary: string;
    logoUrl?: string;
    totalJobs: number;
  }) {
    this.id = data.id;
    this.name = data.name;
    this.summary = data.summary;
    this.logoUrl = data.logoUrl;
    this.totalJobs = data.totalJobs;
  }
}

export class GetCompanyListResponseDto {
  @ApiProperty({ type: [CompanyListItemDto] })
  public readonly companies: CompanyListItemDto[];

  @ApiProperty()
  public readonly total: number;

  public constructor(companies: CompanyListItemDto[], total: number) {
    this.companies = companies;
    this.total = total;
  }
}
