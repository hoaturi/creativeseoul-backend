import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsAlphanumeric,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Trim } from '../../../../common/decorators/trim.decorator';
import { RemoveDuplicates } from '../../../../common/decorators/remove-duplicates.decorator';
import { HasUniqueLanguages } from '../../../../common/decorators/has-unique-languages.decorator';
import { TalentLanguageDto } from './talent-language.dto';
import { Type } from 'class-transformer';
import { TalentSocialLinksDto } from './talent-social-links.dto';

export class UpdateTalentRequestDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  public readonly avatarUrl?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsAlphanumeric()
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

  @ApiProperty({ type: [TalentLanguageDto] })
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
  @MaxLength(16, { each: true })
  @Trim({ each: true })
  @RemoveDuplicates()
  public readonly skills?: string[];

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

  @ApiPropertyOptional({
    type: TalentSocialLinksDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => TalentSocialLinksDto)
  public readonly socialLinks?: TalentSocialLinksDto;
}
