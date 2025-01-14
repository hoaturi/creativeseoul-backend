import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Trim } from '../../../../common/decorators/trim.decorator';
import { COMPANY_SIZES } from '../../../../domain/common/constants/company-size.constant';
import { CompanySocialLinksRequestDto } from './company-social-links-request.dto';

export class UpdateCompanyRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  @Trim()
  public readonly name!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  @Trim()
  public readonly summary!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Trim()
  public readonly description!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  public readonly logoUrl?: string;

  @ApiProperty()
  @IsUrl()
  public readonly websiteUrl!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  @Trim()
  public readonly location!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(COMPANY_SIZES.length)
  public readonly sizeId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => CompanySocialLinksRequestDto)
  public readonly socialLinks?: CompanySocialLinksRequestDto;
}
