import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';
import { EXPERIENCE_LEVELS } from '../../../../domain/job/constants/experience-level.constant';
import { SALARY_RANGE } from '../../../../domain/talent/constants/salary-range.constant';
import { HOURLY_RATE_RANGE } from '../../../../domain/talent/constants/hourly-rate-range.constant';
import {
  EMPLOYMENT_TYPES,
  WORK_LOCATION_TYPES,
} from '../../../../domain/common/constants';
import { AVAILABILITY_STATUS } from '../../../../domain/talent/constants/availability-status.constant';

export class UpdateJobPreferencesRequestDto {
  @ApiProperty()
  @IsNumber()
  @Min(1)
  @Max(AVAILABILITY_STATUS.length)
  public readonly availabilityStatusId!: number;

  @ApiProperty()
  @IsBoolean()
  public readonly isContactable!: boolean;

  @ApiProperty()
  @IsBoolean()
  public readonly requiresVisaSponsorship!: boolean;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @Max(EXPERIENCE_LEVELS.length)
  public readonly experienceLevelId!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(SALARY_RANGE.length)
  public readonly salaryRangeId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(HOURLY_RATE_RANGE.length)
  public readonly hourlyRateRangeId?: number;

  @ApiProperty()
  @IsArray()
  @IsNumber({}, { each: true })
  @Min(1, { each: true })
  @Max(WORK_LOCATION_TYPES.length, { each: true })
  public readonly workLocationTypeIds!: number[];

  @ApiProperty()
  @IsArray()
  @IsNumber({}, { each: true })
  @Min(1, { each: true })
  @Max(EMPLOYMENT_TYPES.length, { each: true })
  public readonly employmentTypeIds!: number[];

  @ApiPropertyOptional()
  @ValidateIf((o) => o.isContactable === true && !o.phone)
  @IsDefined({
    message:
      'Either email or phone must be provided when isContactable is true',
  })
  @IsEmail()
  public readonly email?: string;

  @ApiPropertyOptional()
  @ValidateIf((o) => o.isContactable === true && !o.email)
  @IsDefined({
    message:
      'Either email or phone must be provided when isContactable is true',
  })
  @IsString()
  @IsNotEmpty()
  public readonly phone?: string;
}
