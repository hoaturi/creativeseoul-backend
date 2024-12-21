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
  VALID_LANGUAGE_IDS,
  VALID_LANGUAGE_LEVEL_IDS,
  VALID_STATE_IDS,
  VALID_WORK_LOCATION_TYPE_IDS,
} from '../../../domain/common/constants';
import { Type } from 'class-transformer';
import { HasUniqueLanguages } from '../../../common/decorators/has-unique-languages.decorator';
import { RemoveDuplicates } from '../../../common/decorators/remove-duplicates.decorator';

export class LanguageDto {
  @ApiProperty()
  @IsNumber()
  @IsIn(VALID_LANGUAGE_IDS, { each: true })
  public languageId: number;

  @ApiProperty()
  @IsNumber()
  @IsIn(VALID_LANGUAGE_LEVEL_IDS)
  public level: number;
}

export class CreateCandidateRequestDto {
  @ApiProperty()
  @MinLength(3)
  @MaxLength(64)
  public fullName: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  public title: string;

  @ApiProperty()
  @IsString()
  @MaxLength(1024)
  public bio: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsUrl()
  public profilePictureUrl?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsUrl()
  public resumeUrl?: string;

  @ApiProperty({
    type: [Number],
  })
  @IsArray()
  @RemoveDuplicates()
  @IsNumber({}, { each: true })
  @IsIn(VALID_JOB_CATEGORY_IDS, { each: true })
  @ArrayMinSize(1)
  public preferredCategoryIds: number[];

  @ApiProperty({
    type: [Number],
  })
  @IsArray()
  @RemoveDuplicates()
  @IsNumber({}, { each: true })
  @IsIn(VALID_WORK_LOCATION_TYPE_IDS, { each: true })
  @ArrayMinSize(1)
  public preferredWorkLocationTypeIds: number[];

  @ApiProperty({
    type: [Number],
  })
  @IsArray()
  @RemoveDuplicates()
  @IsNumber({}, { each: true })
  @IsIn(VALID_STATE_IDS, { each: true })
  @ArrayMinSize(1)
  public preferredStateIds: number[];

  @ApiProperty({
    type: [Number],
  })
  @IsArray()
  @RemoveDuplicates()
  @IsNumber({}, { each: true })
  @IsIn(VALID_EMPLOYMENT_TYPE_IDS, { each: true })
  @ArrayMinSize(1)
  public preferredEmploymentTypeIds: number[];

  @ApiProperty({ type: [LanguageDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LanguageDto)
  @ArrayMinSize(1)
  @HasUniqueLanguages()
  public languages: LanguageDto[];

  @ApiProperty()
  @IsBoolean()
  public isAvailable: boolean;
}
