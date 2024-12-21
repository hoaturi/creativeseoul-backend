import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import {
  VALID_EMPLOYMENT_TYPE_IDS,
  VALID_JOB_CATEGORY_IDS,
  VALID_STATE_IDS,
  VALID_WORK_LOCATION_TYPE_IDS,
} from '../../../domain/common/constants';
import { LanguageDto } from './create-candidate-request.dto';
import { Type } from 'class-transformer';
import { HasUniqueLanguages } from '../../../common/decorators/has-unique-languages.decorator';
import { RemoveDuplicates } from '../../../common/decorators/remove-duplicates.decorator';

export class UpdateCandidateRequestDto {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @MinLength(3)
  @MaxLength(64)
  public readonly fullName?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @MinLength(8)
  @MaxLength(128)
  public readonly title?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1024)
  public readonly bio?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsUrl()
  public readonly profilePictureUrl?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsUrl()
  public readonly resumeUrl?: string;

  @ApiProperty({
    required: false,
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @RemoveDuplicates()
  @IsNumber({}, { each: true })
  @IsIn(VALID_JOB_CATEGORY_IDS, { each: true })
  @ArrayMinSize(1)
  public readonly preferredCategoryIds?: number[];

  @ApiProperty({
    required: false,
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @RemoveDuplicates()
  @IsNumber({}, { each: true })
  @IsIn(VALID_WORK_LOCATION_TYPE_IDS, { each: true })
  @ArrayMinSize(1)
  public readonly preferredWorkLocationTypeIds?: number[];

  @ApiProperty({
    required: false,
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @RemoveDuplicates()
  @IsNumber({}, { each: true })
  @IsIn(VALID_STATE_IDS, { each: true })
  @ArrayMinSize(1)
  public readonly preferredStateIds?: number[];

  @ApiProperty({
    required: false,
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @RemoveDuplicates()
  @IsNumber({}, { each: true })
  @IsIn(VALID_EMPLOYMENT_TYPE_IDS, { each: true })
  @ArrayMinSize(1)
  public readonly preferredEmploymentTypeIds?: number[];

  @ApiProperty({
    required: false,
    type: [LanguageDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LanguageDto)
  @ArrayMinSize(1)
  @HasUniqueLanguages()
  public readonly languages?: LanguageDto[];

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  public readonly isAvailable?: boolean;
}
