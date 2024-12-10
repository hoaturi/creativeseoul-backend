import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../../domain/user/user.entity';

export class GetCurrentUserResponseDto {
  @ApiProperty()
  public readonly username: string;

  @ApiProperty({
    enum: UserRole,
  })
  public readonly role: UserRole;

  public constructor(username: string, role: UserRole) {
    this.username = username;
    this.role = role;
  }
}
