import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../../domain/user/user.entity';

export class GetCurrentUserResponseDto {
  @ApiProperty()
  public readonly userName: string;

  @ApiProperty({
    enum: UserRole,
  })
  public readonly role: UserRole;

  public constructor(userName: string, role: UserRole) {
    this.userName = userName;
    this.role = role;
  }
}
