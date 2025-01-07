import { ApiProperty } from '@nestjs/swagger';

export class CompanyListItemDto {
  @ApiProperty()
  public readonly id: string;

  @ApiProperty()
  public readonly name: string;

  @ApiProperty()
  public readonly summary: string;

  @ApiProperty()
  public readonly logoUrl: string;

  @ApiProperty()
  public readonly totalJobs: number;

  public constructor(
    id: string,
    name: string,
    summary: string,
    logoUrl: string,
    totalJobs: number,
  ) {
    this.id = id;
    this.name = name;
    this.summary = summary;
    this.logoUrl = logoUrl;
    this.totalJobs = totalJobs;
  }
}

export class GetCompanyListResponseDto {
  public readonly companies: CompanyListItemDto[];

  public readonly total: number;

  public constructor(companies: CompanyListItemDto[], total: number) {
    this.companies = companies;
    this.total = total;
  }
}
