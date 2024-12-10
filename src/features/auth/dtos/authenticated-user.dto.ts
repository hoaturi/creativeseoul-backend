import { ApiProperty } from '@nestjs/swagger';
import { User, UserRole } from '../../../domain/user/user.entity';

export class AuthenticatedUserDto {
  @ApiProperty()
  public readonly id: string;
  @ApiProperty()
  public readonly userName: string;
  @ApiProperty()
  public readonly email: string;
  @ApiProperty()
  public readonly role: UserRole;

  public constructor(user: Partial<User>) {
    this.id = user.id;
    this.userName = user.userName;
    this.email = user.email;
    this.role = user.role;
  }
}
