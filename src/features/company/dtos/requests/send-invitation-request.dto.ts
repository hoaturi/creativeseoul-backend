import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';
import { Trim } from '../../../../common/decorators/trim.decorator';

export class SendInvitationRequestDto {
  @ApiProperty()
  @IsEmail()
  public readonly email!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  @Trim()
  public readonly companyName!: string;

  @ApiProperty()
  @IsUrl()
  public readonly websiteUrl!: string;
}
