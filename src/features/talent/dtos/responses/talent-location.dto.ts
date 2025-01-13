import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TalentLocationDto {
  @ApiProperty()
  public readonly country: string;

  @ApiPropertyOptional()
  public readonly city?: string;

  public constructor(country: string, city?: string) {
    this.country = country;
    this.city = city;
  }
}
