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
  HOURLY_RATE_RANGE,
  SALARY_RANGE,
  WORK_LOCATION_TYPES,
} from '../../../../domain/common/constants';
import { Trim } from '../../../../common/decorators/trim.decorator';
import { RemoveDuplicates } from '../../../../common/decorators/remove-duplicates.decorator';
import { HasUniqueLanguages } from '../../../../common/decorators/has-unique-languages.decorator';
import { TalentLanguageRequestDto } from './talent-language-request.dto';
import { Type } from 'class-transformer';
import { TalentSocialLinksRequestDto } from './talent-social-links-request.dto';

export class UpdateTalentRequestDto {
  // Basic Profile Information
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  @Trim()
  public readonly fullName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  @Trim()
  public readonly title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(2048)
  @Trim()
  public readonly bio: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  public readonly avatarUrl?: string;

  // Skills and Languages
  @ApiProperty({
    type: TalentLanguageRequestDto,
  })
  @IsArray()
  @HasUniqueLanguages()
  @ValidateNested({ each: true })
  @Type(() => TalentLanguageRequestDto)
  public readonly languages: TalentLanguageRequestDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(15)
  @Trim({ each: true })
  @RemoveDuplicates()
  public readonly skills?: string[];

  // Location Information
  @ApiProperty()
  @IsNumber()
  public readonly countryId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
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
  public readonly employmentTypeIds: number[];

  @ApiProperty()
  @IsArray()
  @IsNumber({}, { each: true })
  @Min(1, { each: true })
  @Max(WORK_LOCATION_TYPES.length, { each: true })
  public readonly locationTypeIds: number[];

  // Profile Status and Visibility
  @ApiProperty()
  @IsBoolean()
  public readonly isPublic: boolean;

  @ApiProperty()
  @IsBoolean()
  public readonly isAvailable: boolean;

  @ApiProperty()
  @IsBoolean()
  public readonly isContactable: boolean;

  @ApiProperty()
  @IsBoolean()
  public readonly requiresVisaSponsorship: boolean;

  // Contact Information
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

  @ApiPropertyOptional({
    type: TalentSocialLinksRequestDto,
  })
  @IsOptional()
  public readonly socialLinks?: TalentSocialLinksRequestDto;
}
