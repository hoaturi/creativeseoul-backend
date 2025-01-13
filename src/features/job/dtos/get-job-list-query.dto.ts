import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Trim } from '../../../common/decorators/trim.decorator';
import { CATEGORIES } from '../../../domain/common/constants/category.constant';
import { SeniorityLevel } from '../../../domain/common/entities/seniority-level.entity';
import {
  EMPLOYMENT_TYPES,
  WORK_LOCATION_TYPES,
} from '../../../domain/common/constants';
import { Transform } from 'class-transformer';
import { LanguageLevel } from '../../../domain/common/entities/language-level.entity';

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
  @Transform(({ value }) =>
    Array.isArray(value) ? value.map((v) => parseInt(v)) : [parseInt(value)],
  )
  public readonly categoryIds?: number[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @Min(1, { each: true })
  @Max(SeniorityLevel.length, { each: true })
  @Transform(({ value }) =>
    Array.isArray(value) ? value.map((v) => parseInt(v)) : [parseInt(value)],
  )
  public readonly seniorityLevelIds?: number[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @Min(1, { each: true })
  @Max(EMPLOYMENT_TYPES.length, { each: true })
  @Transform(({ value }) =>
    Array.isArray(value) ? value.map((v) => parseInt(v)) : [parseInt(value)],
  )
  public readonly employmentTypeIds?: number[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @Min(1, { each: true })
  @Max(WORK_LOCATION_TYPES.length, { each: true })
  @Transform(({ value }) =>
    Array.isArray(value) ? value.map((v) => parseInt(v)) : [parseInt(value)],
  )
  public readonly workLocationTypeIds?: number[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @Min(1, { each: true })
  @Max(LanguageLevel.length, { each: true })
  @Transform(({ value }) =>
    Array.isArray(value) ? value.map((v) => parseInt(v)) : [parseInt(value)],
  )
  public readonly koreanLevelIds?: number[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value ?? value === 'true')
  public readonly residentOnly?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? parseInt(value) : undefined))
  public readonly page?: number;
}
