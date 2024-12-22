import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import {
  COUNTRIES,
  LANGUAGE_LEVELS,
  LANGUAGES,
} from '../../../domain/common/constants';
import { Type } from 'class-transformer';
import { HasUniqueLanguages } from '../../../common/decorators/has-unique-languages.decorator';
import { IsAlphaSpace } from '../../../common/decorators/is-alpha-space.decorator';

export class LanguageDto {
  @ApiProperty()
  @IsNumber()
  @Max(LANGUAGES.length)
  public readonly languageId: number;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @Max(LANGUAGE_LEVELS.NATIVE)
  public readonly level: number;
}

export class CreateMemberRequestDto {
  @ApiProperty()
  @MinLength(3)
  @MaxLength(64)
  public readonly fullName: string;

  @ApiProperty()
  @IsString()
  @MinLength(3)
  @MaxLength(64)
  public readonly title: string;

  @ApiProperty()
  @IsString()
  @MaxLength(512)
  public readonly bio: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsUrl()
  public readonly avatarUrl?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsAlphaSpace({ allowEmpty: true })
  @MaxLength(32)
  public readonly city?: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @Max(COUNTRIES.length)
  public readonly countryId: number;

  @ApiProperty({ type: [LanguageDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LanguageDto)
  @ArrayMinSize(1)
  @HasUniqueLanguages()
  public readonly languages: LanguageDto[];

  @ApiProperty()
  @IsBoolean()
  public readonly isAvailable: boolean;
}
