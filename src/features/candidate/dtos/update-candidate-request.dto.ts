import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { RemoveDuplicates } from '../../../common/decorators/remove-duplicates.decorator';
import {
  EMPLOYMENT_TYPES,
  HOURLY_RATE,
  JOB_CATEGORIES,
  LOCATION_TYPES,
  SALARY_RANGE,
  SENIORITY_LEVELS,
} from '../../../domain/common/constants';

export class UpdateCandidateRequestDto {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  public readonly isOpenToWork?: boolean;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsIn(SENIORITY_LEVELS.map((s) => s.slug))
  public readonly seniority?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsIn(SALARY_RANGE.map((r) => r.slug))
  public readonly salaryRange?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsIn(HOURLY_RATE.map((r) => r.slug))
  public readonly hourlyRateRange?: string;

  @ApiProperty({
    required: false,
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @RemoveDuplicates()
  @IsNumber({}, { each: true })
  @Min(1, { each: true })
  @Max(JOB_CATEGORIES.length, { each: true })
  public readonly jobCategoryIds?: number[];

  @ApiProperty({
    required: false,
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @RemoveDuplicates()
  @IsString({ each: true })
  @IsIn(EMPLOYMENT_TYPES.map((t) => t.slug), { each: true })
  public readonly employmentTypes?: string[];

  @ApiProperty({
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @RemoveDuplicates()
  @IsString({ each: true })
  @IsIn(LOCATION_TYPES.map((t) => t.slug), { each: true })
  public readonly locationTypes?: string[];

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsUrl()
  public readonly resumeUrl?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  public readonly isContactable?: boolean;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsEmail()
  public readonly email?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(32)
  public readonly phone?: string;
}
