import { ApiProperty } from '@nestjs/swagger';

import { AuthenticatedUserDto } from './authenticated-user.dto';

export class LoginResponseDto {
  @ApiProperty()
  public readonly accessToken: string;

  @ApiProperty()
  public readonly user: AuthenticatedUserDto;

  constructor(accessToken: string, user: AuthenticatedUserDto) {
    this.accessToken = accessToken;
    this.user = user;
  }
}
