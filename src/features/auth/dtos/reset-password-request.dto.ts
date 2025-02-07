import { IsString, MinLength } from 'class-validator';
import { MatchesProperty } from '../../../common/decorators/matches-property.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordRequestDto {
  @ApiProperty()
  @IsString()
  public readonly token!: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  public readonly password!: string;

  @ApiProperty()
  @MatchesProperty('password')
  public readonly confirmPassword!: string;
}
