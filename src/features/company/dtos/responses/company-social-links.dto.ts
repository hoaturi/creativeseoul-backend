import { ApiPropertyOptional } from '@nestjs/swagger';

export class CompanySocialLinksDto {
  @ApiPropertyOptional()
  public linkedin?: string;

  @ApiPropertyOptional()
  public twitter?: string;

  @ApiPropertyOptional()
  public instagram?: string;

  @ApiPropertyOptional()
  public youtube?: string;
}
