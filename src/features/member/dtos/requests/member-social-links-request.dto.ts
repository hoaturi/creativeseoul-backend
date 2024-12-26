import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUrl } from 'class-validator';

export class MemberSocialLinksRequestDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({
    protocols: ['https'],
    require_protocol: true,
  })
  public instagram?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({
    protocols: ['https'],
    require_protocol: true,
  })
  public facebook?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({
    protocols: ['https'],
    require_protocol: true,
  })
  public tiktok?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({
    protocols: ['https'],
    require_protocol: true,
  })
  public linkedin?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({
    protocols: ['https'],
    require_protocol: true,
  })
  public github?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({
    protocols: ['https'],
    require_protocol: true,
  })
  public behance?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({
    protocols: ['https'],
    require_protocol: true,
  })
  public twitter?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({
    protocols: ['https'],
    require_protocol: true,
  })
  public dribbble?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({
    protocols: ['https'],
    require_protocol: true,
  })
  public youtube?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({
    protocols: ['https'],
    require_protocol: true,
  })
  public vimeo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({
    protocols: ['https'],
    require_protocol: true,
  })
  public artstation?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({
    protocols: ['https'],
    require_protocol: true,
  })
  public medium?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({
    protocols: ['https'],
    require_protocol: true,
  })
  public substack?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({
    protocols: ['https'],
    require_protocol: true,
  })
  public website?: string;
}
