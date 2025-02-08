import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
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
import { Trim } from '../../../../common/decorators/trim.decorator';
import { COMPANY_SIZES } from '../../../../domain/company/company-size.constant';
import { CompanySocialLinksDto } from './company-social-links.dto';
import { Type } from 'class-transformer';

export class SendInvitationRequestDto {
  @ApiProperty()
  @IsEmail()
  public readonly email!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  @Trim()
  public readonly name!: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @Max(COMPANY_SIZES.length)
  public readonly sizeId!: number;

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

  @ApiProperty()
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  @Trim()
  public readonly location!: string;

  @ApiProperty()
  @IsUrl()
  public readonly websiteUrl!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  @Trim()
  public readonly city?: string;

  @ApiPropertyOptional({
    type: CompanySocialLinksDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CompanySocialLinksDto)
  public readonly socialLinks?: CompanySocialLinksDto;
}
