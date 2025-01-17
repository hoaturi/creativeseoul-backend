import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import {
  EMPLOYMENT_TYPES,
  WORK_LOCATION_TYPES,
} from '../../../../domain/common/constants';
import { Trim } from '../../../../common/decorators/trim.decorator';
import { RemoveDuplicates } from '../../../../common/decorators/remove-duplicates.decorator';
import { HasUniqueLanguages } from '../../../../common/decorators/has-unique-languages.decorator';
import { TalentLanguageDto } from './talent-language.dto';
import { Type } from 'class-transformer';
import { TalentSocialLinksDto } from './talent-social-links.dto';
import { SALARY_RANGE } from '../../../../domain/talent/constants/salary-range.constant';
import { HOURLY_RATE_RANGE } from '../../../../domain/talent/constants/hourly-rate-range.constant';

export class UpdateTalentRequestDto {
  // Basic Profile Information
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(16)
  @Trim()
  public readonly handle!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  @Trim()
  public readonly fullName!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  @Trim()
  public readonly title!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(2048)
  @Trim()
  public readonly bio!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  public readonly avatarUrl?: string;

  // Skills and Languages
  @ApiProperty({
    type: TalentLanguageDto,
  })
  @IsArray()
  @HasUniqueLanguages()
  @ValidateNested({ each: true })
  @Type(() => TalentLanguageDto)
  public readonly languages!: TalentLanguageDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @IsString({ each: true })
  @Trim({ each: true })
  @RemoveDuplicates()
  public readonly skills?: string[];

  // Location Information
  @ApiProperty()
  @IsNumber()
  public readonly countryId!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  @Trim()
  public readonly city?: string;

  // Work Preferences
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
  @Max(EMPLOYMENT_TYPES.length, { each: true })
  public readonly employmentTypeIds!: number[];

  @ApiProperty()
  @IsArray()
  @IsNumber({}, { each: true })
  @Min(1, { each: true })
  @Max(WORK_LOCATION_TYPES.length, { each: true })
  public readonly locationTypeIds!: number[];

  // Profile Status and Visibility
  @ApiProperty()
  @IsBoolean()
  public readonly isPublic!: boolean;

  @ApiProperty()
  @IsBoolean()
  public readonly isAvailable!: boolean;

  @ApiProperty()
  @IsBoolean()
  public readonly isContactable!: boolean;

  @ApiProperty()
  @IsBoolean()
  public readonly requiresVisaSponsorship!: boolean;

  // Contact Information
  @ApiPropertyOptional({
    description: 'Either email or phone is required if isContactable is true',
  })
  @ValidateIf((o: UpdateTalentRequestDto) => o.isContactable && !o.phone)
  @IsEmail()
  public readonly email?: string;

  @ApiPropertyOptional()
  @ValidateIf((o: UpdateTalentRequestDto) => o.isContactable && !o.email)
  @IsString()
  @IsNotEmpty()
  @MaxLength(16)
  @Trim()
  public readonly phone?: string;

  @ApiPropertyOptional({
    type: TalentSocialLinksDto,
  })
  @IsOptional()
  public readonly socialLinks?: TalentSocialLinksDto;
}
