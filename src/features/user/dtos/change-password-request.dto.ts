import { IsString, MinLength } from 'class-validator';
import { MatchesProperty } from '../../../common/decorators/matches-property.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordRequestDto {
  @ApiProperty()
  @IsString()
  public readonly currentPassword!: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  public readonly newPassword!: string;

  @ApiProperty()
  @MatchesProperty('newPassword')
  public readonly confirmPassword!: string;
}
