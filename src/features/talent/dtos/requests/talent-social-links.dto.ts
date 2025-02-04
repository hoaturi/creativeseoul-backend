import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUrl } from 'class-validator';

export class TalentSocialLinksDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  public readonly instagram?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  public readonly facebook?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  public readonly linkedin?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  public readonly github?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  public readonly behance?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  public readonly twitter?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  public readonly dribbble?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  public readonly youtube?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  public readonly vimeo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  public readonly artstation?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  public readonly medium?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  public readonly website?: string;
}
