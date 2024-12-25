import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsAlphanumeric,
  IsArray,
  IsLowercase,
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
import { MemberSocialLinksDto } from './member-social-links.dto';

export class UpdateMemberRequestDto {
  @ApiProperty()
  @IsString()
  @IsAlphanumeric()
  @IsLowercase()
  @MinLength(3)
  @MaxLength(16)
  @Trim()
  public readonly handle: string;

  @ApiProperty()
  @IsString()
  @IsAlphaSpace()
  @MinLength(3)
  @MaxLength(64)
  @Trim()
  public readonly fullName: string;

  @ApiProperty()
  @IsString()
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
  @IsArray()
  @ArrayMaxSize(5)
  @IsValidTags()
  @MaxLength(16, { each: true })
  @Trim({ each: true })
  public readonly tags: string[];

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @Max(COUNTRIES.length)
  public readonly countryId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsAlphaSpace()
  @MinLength(3)
  @MaxLength(32)
  @Trim()
  public readonly city?: string;

  @ApiProperty({ type: [MemberLanguageDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @HasUniqueLanguages()
  @Type(() => MemberLanguageDto)
  public readonly languages: MemberLanguageDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  @Trim()
  public readonly avatarUrl?: string;

  @ApiPropertyOptional({ type: MemberSocialLinksDto })
  @IsOptional()
  @ValidateNested()
  public readonly socialLinks?: MemberSocialLinksDto;
}
