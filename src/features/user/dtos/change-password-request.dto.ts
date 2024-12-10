import { IsString } from 'class-validator';
import { IsPassword } from '../../../common/decorators/is-password.decorator';
import { MatchesProperty } from '../../../common/decorators/matches-property.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordRequestDto {
  @ApiProperty()
  @IsString()
  public readonly currentPassword: string;

  @ApiProperty()
  @IsPassword()
  public readonly newPassword: string;

  @ApiProperty()
  @MatchesProperty('newPassword')
  public readonly confirmPassword: string;
}
