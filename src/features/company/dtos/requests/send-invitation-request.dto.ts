import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { Trim } from '../../../../common/decorators/trim.decorator';
import { COMPANY_SIZES } from '../../../../domain/company/company-size.constant';

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
  @MaxLength(64)
  @Trim()
  public readonly location!: string;

  @ApiProperty()
  @IsUrl()
  public readonly websiteUrl!: string;
}
