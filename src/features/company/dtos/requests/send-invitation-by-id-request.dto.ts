import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class SendInvitationByIdRequestDto {
  @ApiProperty()
  @IsEmail()
  public readonly email!: string;
}
