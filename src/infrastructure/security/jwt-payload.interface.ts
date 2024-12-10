import { UserRole } from '../../domain/user/user.entity';

export interface JwtPayload {
  userId: string;
  role: UserRole;
}
