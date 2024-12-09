import { IsString, Matches, MinLength } from 'class-validator';
import { MatchesProperty } from '../../../common/decorators/matches-property.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordRequestDto {
  @ApiProperty()
  @IsString()
  public readonly token: string;

  @ApiProperty()
  @IsString()
  @Matches(/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/, {
    message:
      'Password can only contain letters, numbers and special characters',
  })
  @MinLength(8)
  public readonly password: string;

  @ApiProperty()
  @IsString()
  @MatchesProperty('password')
  public readonly confirmPassword: string;
}
