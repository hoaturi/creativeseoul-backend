import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
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

  @ApiProperty()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(EMPLOYMENT_TYPES.length)
  @IsString({ each: true })
  @IsIn(EMPLOYMENT_TYPES.map((t) => t.slug), { each: true })
  public readonly employmentTypes: string[];

  @ApiProperty()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(LOCATION_TYPES.length)
  @IsString({ each: true })
  @IsIn(LOCATION_TYPES.map((t) => t.slug), { each: true })
  public readonly locationTypes: string[];

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
  @IsIn(HOURLY_RATE_RANGE.map((r) => r.slug))
  public readonly hourlyRateRange?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsIn(SALARY_RANGE.map((r) => r.slug))
  public readonly salaryRange?: string;

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
