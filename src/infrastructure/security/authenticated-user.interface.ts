import { UserRole } from '../../domain/user/user.entity';

export interface AuthenticatedUser {
  id: string;
  role: UserRole;
}
