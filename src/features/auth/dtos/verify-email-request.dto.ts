import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailRequestDto {
  @ApiProperty()
  @IsString()
  public readonly token: string;
}
