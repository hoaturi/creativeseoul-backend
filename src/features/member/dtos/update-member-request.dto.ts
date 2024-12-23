import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @MinLength(3)
  @MaxLength(64)
  @Trim()
  public readonly fullName?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @MinLength(3)
  @MaxLength(32)
  @Trim()
  public readonly title?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(512)
  @Trim()
  public readonly bio?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsUrl()
  @Trim()
  public readonly avatarUrl?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsValidTags()
  @Trim({ each: true })
  public readonly tags?: string[];

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsAlphaSpace({ allowEmpty: true })
  @MinLength(3)
  @MaxLength(32)
  @Trim()
  public readonly city?: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(COUNTRIES.length)
  public readonly countryId?: number;

  @ApiProperty({
    required: false,
    type: [MemberLanguageDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MemberLanguageDto)
  @ArrayMinSize(1)
  @HasUniqueLanguages()
  public readonly languages?: MemberLanguageDto[];
}
