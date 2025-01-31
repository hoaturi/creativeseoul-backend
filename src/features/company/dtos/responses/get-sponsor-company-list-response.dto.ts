import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GetSponsorCompanyListItemDto {
  @ApiProperty()
  public readonly slug: string;

  @ApiProperty()
  public readonly name: string;

  @ApiPropertyOptional()
  public readonly summary?: string;

  @ApiPropertyOptional()
  public readonly logoUrl?: string;

  public constructor(data: {
    slug: string;
    name: string;
    summary?: string;
    logoUrl?: string;
  }) {
    this.slug = data.slug;
    this.name = data.name;
    this.summary = data.summary;
    this.logoUrl = data.logoUrl;
  }
}

export class GetSponsorCompanyListResponseDto {
  @ApiProperty({ type: [GetSponsorCompanyListItemDto] })
  public readonly companies: GetSponsorCompanyListItemDto[];

  public constructor(companies: GetSponsorCompanyListItemDto[]) {
    this.companies = companies;
  }
}
