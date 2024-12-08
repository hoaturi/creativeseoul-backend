import { UserRole } from '../user/user.entity';

export interface JwtTokenPayload {
  userId: string;
  role: UserRole;
}
