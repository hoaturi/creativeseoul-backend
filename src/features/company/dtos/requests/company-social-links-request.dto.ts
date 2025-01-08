import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUrl } from 'class-validator';

export class CompanySocialLinksRequestDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  public readonly linkedin?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  public readonly twitter?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  public readonly youtube?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  public readonly instagram?: string;
}
