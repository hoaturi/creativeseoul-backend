import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CompanySocialLinksDto } from './get-company-response.dto';

export class GetMyCompanyResponseDto {
  @ApiProperty()
  public readonly slug: string;

  @ApiProperty()
  public readonly name: string;

  @ApiProperty()
  public readonly summary: string;

  @ApiPropertyOptional()
  public readonly description?: string;

  @ApiPropertyOptional()
  public readonly logoUrl?: string;

  @ApiProperty()
  public readonly websiteUrl: string;

  @ApiProperty()
  public readonly location: string;

  @ApiProperty()
  public readonly sizeId: number;

  @ApiPropertyOptional()
  public readonly socialLinks?: CompanySocialLinksDto;

  public constructor(data: {
    slug: string;
    name: string;
    summary: string;
    description?: string;
    logoUrl?: string;
    websiteUrl: string;
    location: string;
    sizeId: number;
    socialLinks?: CompanySocialLinksDto;
  }) {
    this.slug = data.slug;
    this.name = data.name;
    this.summary = data.summary;
    this.description = data.description;
    this.logoUrl = data.logoUrl;
    this.websiteUrl = data.websiteUrl;
    this.location = data.location;
    this.sizeId = data.sizeId;
    this.socialLinks = data.socialLinks;
  }
}
