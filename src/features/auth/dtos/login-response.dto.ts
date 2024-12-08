import { UserRole } from '../../../domain/user/user.entity';

export interface UserResponse {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
}

export class LoginResponseDto {
  constructor(
    public readonly accessToken: string,
    public readonly refreshToken: string,
    public readonly user: UserResponse,
  ) {}
}
