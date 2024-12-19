import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import {
  VALID_EMPLOYMENT_TYPE_IDS,
  VALID_JOB_CATEGORY_IDS,
  VALID_LANGUAGE_IDS,
  VALID_STATE_IDS,
  VALID_WORK_LOCATION_TYPE_IDS,
} from '../../../domain/common/constants';

export class GetCandidateListQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  public readonly page?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public readonly search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value
      : value?.split(',').map(Number).filter(Boolean),
  )
  @IsArray()
  @IsNumber({}, { each: true })
  @IsIn(VALID_JOB_CATEGORY_IDS, { each: true })
  public readonly categories?: number[];

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value
      : value?.split(',').map(Number).filter(Boolean),
  )
  @IsArray()
  @IsNumber({}, { each: true })
  @IsIn(VALID_EMPLOYMENT_TYPE_IDS, { each: true })
  public readonly employment_types?: number[];

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value
      : value?.split(',').map(Number).filter(Boolean),
  )
  @IsArray()
  @IsNumber({}, { each: true })
  @IsIn(VALID_WORK_LOCATION_TYPE_IDS, { each: true })
  public readonly work_location_types?: number[];

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value
      : value?.split(',').map(Number).filter(Boolean),
  )
  @IsArray()
  @IsNumber({}, { each: true })
  @IsIn(VALID_STATE_IDS, { each: true })
  public readonly states?: number[];

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value
      : value?.split(',').map(Number).filter(Boolean),
  )
  @IsArray()
  @IsNumber({}, { each: true })
  @IsIn(VALID_LANGUAGE_IDS, { each: true })
  public readonly languages?: number[];
}
