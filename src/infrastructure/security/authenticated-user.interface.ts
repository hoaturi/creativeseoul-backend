import { UserRole } from '../../domain/user/user-role.enum';

export interface AuthenticatedUser {
  id: string;
  role: UserRole;
  profileId: string;
}
