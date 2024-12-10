import { IsString } from 'class-validator';
import { MatchesProperty } from '../../../common/decorators/matches-property.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { IsPassword } from '../../../common/decorators/is-password.decorator';

export class ResetPasswordRequestDto {
  @ApiProperty()
  @IsString()
  public readonly token: string;

  @ApiProperty()
  @IsPassword()
  public readonly password: string;

  @ApiProperty()
  @IsString()
  @MatchesProperty('password')
  public readonly confirmPassword: string;
}
