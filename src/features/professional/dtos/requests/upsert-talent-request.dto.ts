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
  Max,
  MaxLength,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import {
  EMPLOYMENT_TYPES,
  HOURLY_RATE_RANGE,
  LOCATION_TYPES,
  SALARY_RANGE,
} from '../../../../domain/common/constants';
import { Trim } from '../../../../common/decorators/trim.decorator';
import { RemoveDuplicates } from '../../../../common/decorators/remove-duplicates.decorator';
import { TalentSocialLinks } from '../../../../domain/talent/talent-social-links.interface';
import { HasUniqueLanguages } from '../../../../common/decorators/has-unique-languages.decorator';
import { TalentLanguageRequestDto } from './talent-language-request.dto';

export class UpsertTalentRequestDto {
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

  @ApiProperty({
    type: TalentLanguageRequestDto,
  })
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @HasUniqueLanguages()
  public readonly languages: TalentLanguageRequestDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public readonly avatarUrl?: string;

  @ApiProperty()
  @IsBoolean()
  public readonly isPublic: boolean;

  @ApiProperty()
  @IsBoolean()
  public readonly requiresVisaSponsorship: boolean;

  @ApiProperty()
  @IsBoolean()
  public readonly isAvailable: boolean;

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

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(15)
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
  public readonly socialLinks?: TalentSocialLinks;

  @ApiPropertyOptional()
  @IsNumber()
  public readonly countryId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public readonly city?: string;
}
