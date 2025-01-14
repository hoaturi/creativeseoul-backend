import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsAlpha,
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
import { CATEGORIES } from '../../../domain/common/constants/category.constant';
import {
  EMPLOYMENT_TYPES,
  LANGUAGE_LEVELS,
  SENIORITY_LEVELS,
  WORK_LOCATION_TYPES,
} from '../../../domain/common/constants';
import { RemoveDuplicates } from '../../../common/decorators/remove-duplicates.decorator';
import { Trim } from '../../../common/decorators/trim.decorator';

export class UpdateJobRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  public readonly title!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
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
  public readonly location!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  public readonly minSalary?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  public readonly maxSalary?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(5)
  @IsNotEmpty({ each: true })
  @IsAlpha('en-US', { each: true })
  @RemoveDuplicates()
  @Trim({ each: true })
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
