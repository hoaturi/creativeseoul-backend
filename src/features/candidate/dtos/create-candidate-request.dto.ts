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
  VALID_LANGUAGE_PROFICIENCY_LEVEL_IDS,
  VALID_STATE_IDS,
  VALID_WORK_LOCATION_TYPE_IDS,
} from '../../../domain/common/constants';
import { Type } from 'class-transformer';

export class LanguageDto {
  @ApiProperty()
  @IsNumber()
  @IsIn(VALID_LANGUAGE_IDS, { each: true })
  public languageId!: number;

  @ApiProperty()
  @IsNumber()
  @IsIn(VALID_LANGUAGE_PROFICIENCY_LEVEL_IDS)
  public proficiencyLevel!: number;
}

export class CreateCandidateRequestDto {
  @ApiProperty()
  @MinLength(3)
  @MaxLength(64)
  public fullName!: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  public title!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(1024)
  public bio!: string;

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
  @IsNumber({}, { each: true })
  @IsIn(VALID_JOB_CATEGORY_IDS, { each: true })
  public preferredCategories!: number[];

  @ApiProperty({
    type: [Number],
  })
  @IsNumber({}, { each: true })
  @IsIn(VALID_WORK_LOCATION_TYPE_IDS, { each: true })
  public preferredWorkLocations!: number[];

  @ApiProperty({
    type: [Number],
  })
  @IsNumber({}, { each: true })
  @IsIn(VALID_STATE_IDS, { each: true })
  public preferredStates!: number[];

  @ApiProperty({ type: [LanguageDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LanguageDto)
  @ArrayMinSize(1)
  public languages!: LanguageDto[];

  @ApiProperty({
    type: [Number],
  })
  @IsNumber({}, { each: true })
  @IsIn(VALID_EMPLOYMENT_TYPE_IDS, { each: true })
  public preferredEmploymentTypes!: number[];

  @ApiProperty()
  @IsBoolean()
  public isAvailable!: boolean;
}
