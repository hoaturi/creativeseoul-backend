import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GetUnclaimedCompanyListItemDto {
  @ApiProperty()
  public readonly id: string;

  @ApiProperty()
  public readonly name: string;

  @ApiProperty()
  public readonly websiteUrl: string;

  @ApiPropertyOptional()
  public readonly logoUrl?: string;

  public constructor(data: {
    id: string;
    name: string;
    websiteUrl: string;
    logoUrl?: string;
  }) {
    this.id = data.id;
    this.name = data.name;
    this.websiteUrl = data.websiteUrl;
    this.logoUrl = data.logoUrl;
  }
}

export class GetUnclaimedCompanyListResponseDto {
  @ApiProperty({ type: [GetUnclaimedCompanyListItemDto] })
  public readonly companies: GetUnclaimedCompanyListItemDto[];

  public constructor(companies: GetUnclaimedCompanyListItemDto[]) {
    this.companies = companies;
  }
}
