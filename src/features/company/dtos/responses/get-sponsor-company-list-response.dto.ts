import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GetSponsorCompanyListItemDto {
  @ApiProperty()
  public readonly id: string;

  @ApiProperty()
  public readonly name: string;

  @ApiPropertyOptional()
  public readonly summary?: string;

  @ApiPropertyOptional()
  public readonly logoUrl?: string;

  @ApiProperty()
  public readonly websiteUrl: string;

  public constructor(data: {
    id: string;
    name: string;
    summary?: string;
    logoUrl?: string;
    websiteUrl: string;
  }) {
    this.id = data.id;
    this.name = data.name;
    this.summary = data.summary;
    this.logoUrl = data.logoUrl;
    this.websiteUrl = data.websiteUrl;
  }
}

export class GetSponsorCompanyListResponseDto {
  @ApiProperty({ type: [GetSponsorCompanyListItemDto] })
  public readonly companies: GetSponsorCompanyListItemDto[];

  public constructor(companies: GetSponsorCompanyListItemDto[]) {
    this.companies = companies;
  }
}
