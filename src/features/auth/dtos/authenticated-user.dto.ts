import { ApiProperty } from '@nestjs/swagger';
import { User, UserRole } from '../../../domain/user/user.entity';

export class AuthenticatedUserDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  fullName: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  role: UserRole;

  constructor(user: Partial<User>) {
    this.id = user.id;
    this.fullName = user.userName;
    this.email = user.email;
    this.role = user.role;
  }
}
