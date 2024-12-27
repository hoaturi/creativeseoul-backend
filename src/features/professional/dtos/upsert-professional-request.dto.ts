import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  Max,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import {
  EMPLOYMENT_TYPES,
  HOURLY_RATE_RANGE,
  LOCATION_TYPES,
  SALARY_RANGE,
} from '../../../domain/common/constants';
import { IsValidTags } from '../../../common/decorators/is-valid-tags.decorator';
import { Trim } from '../../../common/decorators/trim.decorator';
import { ProfessionalExperienceRequestDto } from './professional-experience-request.dto';
import { ProfessionalProjectRequestDto } from './professional-project-request.dto';
import { RemoveDuplicates } from '../../../common/decorators/remove-duplicates.decorator';

export class UpsertProfessionalRequestDto {
  @ApiProperty()
  @IsBoolean()
  public readonly isPublic: boolean;

  @ApiProperty()
  @IsBoolean()
  public readonly isOpenToWork: boolean;

  @ApiProperty()
  @IsBoolean()
  public readonly isContactable: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(HOURLY_RATE_RANGE.length)
  public readonly hourlyRateRangeId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(SALARY_RANGE.length)
  public readonly salaryRangeId?: number;

  @ApiProperty()
  @IsArray()
  @IsNumber({}, { each: true })
  @Min(1, { each: true })
  @Max(EMPLOYMENT_TYPES.length, { each: true })
  public readonly employmentTypeIds: number[];

  @ApiProperty()
  @IsArray()
  @IsNumber({}, { each: true })
  @Min(1, { each: true })
  @Max(LOCATION_TYPES.length, { each: true })
  public readonly locationTypeIds: number[];

  @ApiPropertyOptional({
    type: [ProfessionalExperienceRequestDto],
  })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @ValidateNested({ each: true })
  public readonly experiences?: ProfessionalExperienceRequestDto[];

  @ApiPropertyOptional({
    type: [ProfessionalProjectRequestDto],
  })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(8)
  @ValidateNested({ each: true })
  public readonly projects?: ProfessionalProjectRequestDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(15)
  @IsValidTags()
  @Trim({ each: true })
  @RemoveDuplicates()
  public readonly skills?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateIf((o) => o.isContactable === true)
  @IsEmail()
  public readonly email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateIf((o) => o.isContactable === true)
  @IsString()
  @Trim()
  public readonly phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  @Matches(/\.(pdf|doc|docx)$/i, {
    message: 'Resume URL must point to a PDF or Word document',
  })
  public readonly resumeUrl?: string;
}
