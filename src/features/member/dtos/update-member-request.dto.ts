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
import { LanguageDto } from './create-member-request.dto';
import { Type } from 'class-transformer';
import { HasUniqueLanguages } from '../../../common/decorators/has-unique-languages.decorator';
import { IsAlphaSpace } from '../../../common/decorators/is-alpha-space.decorator';
import { COUNTRIES } from '../../../domain/common/constants';

export class UpdateMemberRequestDto {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  public readonly isPublic?: boolean;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @MinLength(3)
  @MaxLength(64)
  public readonly fullName?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @MinLength(3)
  @MaxLength(64)
  public readonly title?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(512)
  public readonly bio?: string;

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
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(COUNTRIES.length)
  public readonly countryId?: number;

  @ApiProperty({
    required: false,
    type: [LanguageDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LanguageDto)
  @ArrayMinSize(1)
  @HasUniqueLanguages()
  public readonly languages?: LanguageDto[];
}
