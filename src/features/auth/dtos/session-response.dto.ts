import { AuthenticatedUser } from '../../../infrastructure/security/authenticated-user.interface';
import { ApiProperty } from '@nestjs/swagger';

export class SessionResponseDto {
  @ApiProperty({
    type: 'object',
    properties: {
      id: { type: 'string' },
      role: { type: 'string' },
      profileId: { type: 'string', nullable: true },
    },
  })
  public readonly user: AuthenticatedUser;

  public constructor(user: AuthenticatedUser) {
    this.user = user;
  }
}
