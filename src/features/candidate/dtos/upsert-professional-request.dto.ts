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
  MaxLength,
  ValidateNested,
} from 'class-validator';
import {
  EMPLOYMENT_TYPES,
  HOURLY_RATE_RANGE,
  LOCATION_TYPES,
  SALARY_RANGE,
} from '../../../domain/common/constants';
import { RemoveDuplicates } from '../../../common/decorators/remove-duplicates.decorator';
import { ProfessionalExperienceDto } from './professional-experience.dto';
import { ProfessionalProjectDto } from './professional-project.dto';
import { IsValidTags } from '../../../common/decorators/is-valid-tags.decorator';

export class UpsertProfessionalRequestDto {
  @ApiProperty()
  @IsBoolean()
  public readonly isOpenToWork: boolean;

  @ApiProperty()
  @IsBoolean()
  public readonly isPublic: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsIn(SALARY_RANGE.map((r) => r.slug))
  public readonly salaryRange: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsIn(HOURLY_RATE_RANGE.map((r) => r.slug))
  public readonly hourlyRateRange: string;

  @ApiProperty({
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1)
  @RemoveDuplicates()
  @IsString({ each: true })
  @IsIn(LOCATION_TYPES.map((t) => t.slug), { each: true })
  public readonly locationTypes: string[];

  @ApiProperty({
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1)
  @RemoveDuplicates()
  @IsString({ each: true })
  @IsIn(EMPLOYMENT_TYPES.map((t) => t.slug), { each: true })
  public readonly employmentTypes: string[];

  @ApiPropertyOptional({
    type: [ProfessionalExperienceDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  public readonly experiences: ProfessionalExperienceDto[];

  @ApiPropertyOptional({
    type: [ProfessionalProjectDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  public readonly projects: ProfessionalProjectDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  @IsValidTags({ each: true })
  public readonly skills: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  public readonly resumeUrl: string;

  @ApiProperty()
  @IsBoolean()
  public readonly isContactable: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  public readonly email: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(32)
  public readonly phone: string;
}
