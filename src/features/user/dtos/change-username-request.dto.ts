import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class ChangeUsernameRequestDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  @MaxLength(16)
  public username: string;
}
