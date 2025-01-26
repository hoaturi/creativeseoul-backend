import { UserRole } from '../../domain/user/user-role.enum';

export interface AuthenticatedUser {
  id: string;
  role: UserRole;
  profile: {
    id?: string;
    name?: string;
    avatarUrl?: string;
  };
}
