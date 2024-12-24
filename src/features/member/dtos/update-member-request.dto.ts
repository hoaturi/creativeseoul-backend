import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
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
import { Type } from 'class-transformer';
import { HasUniqueLanguages } from '../../../common/decorators/has-unique-languages.decorator';
import { IsAlphaSpace } from '../../../common/decorators/is-alpha-space.decorator';
import { COUNTRIES } from '../../../domain/common/constants';
import { IsValidTags } from '../../../common/decorators/is-valid-tags.decorator';
import { Trim } from '../../../common/decorators/trim.decorator';
import { MemberLanguageDto } from './member-language.dto';

export class UpdateMemberRequestDto {
  @ApiProperty()
  @MinLength(3)
  @MaxLength(64)
  @Trim()
  public readonly fullName: string;

  @ApiProperty()
  @MinLength(3)
  @MaxLength(32)
  @Trim()
  public readonly title: string;

  @ApiProperty()
  @IsString()
  @MaxLength(512)
  @Trim()
  public readonly bio: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  @Trim()
  public readonly avatarUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsValidTags()
  @Trim({ each: true })
  public readonly tags: string[] | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsAlphaSpace()
  @MinLength(3)
  @MaxLength(32)
  @Trim()
  public readonly city?: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @Max(COUNTRIES.length)
  public readonly countryId: number;

  @ApiProperty({
    type: [MemberLanguageDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MemberLanguageDto)
  @ArrayMinSize(1)
  @HasUniqueLanguages()
  public readonly languages: MemberLanguageDto[];
}
