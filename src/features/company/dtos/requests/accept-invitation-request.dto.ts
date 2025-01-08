import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
import { IsPassword } from '../../../../common/decorators/is-password.decorator';

export class AcceptInvitationRequestDto {
  @ApiProperty()
  @IsEmail()
  public readonly email: string;

  @ApiProperty()
  @IsPassword()
  public readonly password: string;

  @ApiProperty()
  @IsString()
  public readonly token: string;
}
