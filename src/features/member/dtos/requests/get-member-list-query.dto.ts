import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { COUNTRIES } from '../../../../domain/common/constants';

export class GetMemberListQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public readonly search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(COUNTRIES.length)
  @Transform(({ value }) => (value ? parseInt(value) : undefined))
  public readonly countryId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => (value ? parseInt(value) : undefined))
  public readonly page?: number;
}
