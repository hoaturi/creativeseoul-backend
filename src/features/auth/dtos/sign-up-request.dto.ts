import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsPassword } from '../../../common/decorators/is-password.decorator';

export class SignUpRequestDto {
  @ApiProperty()
  @IsEmail()
  public readonly email: string;

  @ApiProperty()
  @IsPassword()
  public readonly password: string;
}
