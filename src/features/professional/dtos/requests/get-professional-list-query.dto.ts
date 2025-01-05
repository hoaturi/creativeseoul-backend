import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class GetProfessionalListQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public readonly search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value ?? value === 'true')
  public readonly isOpenToWork?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @Transform(({ value }) => {
    if (!value) return undefined;
    return Array.isArray(value)
      ? value.map((v) => parseInt(v))
      : [parseInt(value)];
  })
  public readonly employmentTypeIds?: number[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @Transform(({ value }) => {
    if (!value) return undefined;
    return Array.isArray(value)
      ? value.map((v) => parseInt(v))
      : [parseInt(value)];
  })
  public readonly locationTypeIds?: number[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? parseInt(value) : undefined))
  public readonly countryId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? parseInt(value) : undefined))
  public readonly page?: number;
}
