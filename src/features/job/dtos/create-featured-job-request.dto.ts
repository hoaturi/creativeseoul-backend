import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { CATEGORIES } from '../../../domain/job/constants/category.constant';
import {
  EMPLOYMENT_TYPES,
  LANGUAGE_LEVELS,
  WORK_LOCATION_TYPES,
} from '../../../domain/common/constants';
import { Trim } from '../../../common/decorators/trim.decorator';
import { RemoveDuplicates } from '../../../common/decorators/remove-duplicates.decorator';
import { SENIORITY_LEVELS } from '../../../domain/job/constants/seniority-level.constant';
import { ToLowerCase } from '../../../common/decorators/to-lower-case.decorator';

export class CreateFeaturedJobRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  @Trim()
  public readonly title!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Trim()
  public readonly description!: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @Max(CATEGORIES.length)
  public readonly categoryId!: number;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @Max(EMPLOYMENT_TYPES.length)
  public readonly employmentTypeId!: number;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @Max(SENIORITY_LEVELS.length)
  public readonly seniorityLevelId!: number;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @Max(WORK_LOCATION_TYPES.length)
  public readonly workLocationTypeId!: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  @Trim()
  public readonly location!: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  public readonly minSalary!: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  public readonly maxSalary!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(5)
  @IsNotEmpty({ each: true })
  @RemoveDuplicates()
  @Trim({ each: true })
  @ToLowerCase({ each: true })
  public readonly tags?: string[];

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @Max(LANGUAGE_LEVELS.length)
  public readonly koreanLevelId!: number;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @Max(LANGUAGE_LEVELS.length)
  public readonly englishLevelId!: number;

  @ApiProperty()
  @IsBoolean()
  public readonly residentOnly!: boolean;

  @ApiProperty()
  @IsUrl()
  public readonly applicationUrl!: string;
}
