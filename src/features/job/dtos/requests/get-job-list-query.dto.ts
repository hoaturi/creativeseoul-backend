import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Trim } from '../../../../common/decorators/trim.decorator';
import { CATEGORIES } from '../../../../domain/job/constants/category.constant';
import {
  EMPLOYMENT_TYPES,
  LANGUAGE_LEVELS,
  WORK_LOCATION_TYPES,
} from '../../../../domain/common/constants';
import { Transform } from 'class-transformer';
import { EXPERIENCE_LEVELS } from '../../../../domain/job/constants/experience-level.constant';

export class GetJobListQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Trim()
  public readonly search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @Min(1, { each: true })
  @Max(CATEGORIES.length, { each: true })
  @Transform(({ value }) => {
    const values = Array.isArray(value) ? value : value.split(',');
    return values.map((v: string) => parseInt(v));
  })
  public readonly categoryIds?: number[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @Min(1, { each: true })
  @Max(EXPERIENCE_LEVELS.length, { each: true })
  @Transform(({ value }) => {
    const values = Array.isArray(value) ? value : value.split(',');
    return values.map((v: string) => parseInt(v));
  })
  public readonly experienceLevelIds?: number[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @Min(1, { each: true })
  @Max(EMPLOYMENT_TYPES.length, { each: true })
  @Transform(({ value }) => {
    const values = Array.isArray(value) ? value : value.split(',');
    return values.map((v: string) => parseInt(v));
  })
  public readonly employmentTypeIds?: number[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @Min(1, { each: true })
  @Max(WORK_LOCATION_TYPES.length, { each: true })
  @Transform(({ value }) => {
    const values = Array.isArray(value) ? value : value.split(',');
    return values.map((v: string) => parseInt(v));
  })
  public readonly workLocationTypeIds?: number[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @Min(1, { each: true })
  @Max(LANGUAGE_LEVELS.length, { each: true })
  @Transform(({ value }) => {
    const values = Array.isArray(value) ? value : value.split(',');
    return values.map((v: string) => parseInt(v));
  })
  public readonly koreanLevelIds?: number[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value ?? value === 'true')
  public readonly residentOnly?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? parseInt(value) : undefined))
  public readonly page?: number;
}
