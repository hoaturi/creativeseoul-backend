import { AuthenticatedUser } from '../../../../infrastructure/security/authenticated-user.interface';

export class LoginCommandResult {
  public constructor(public readonly user: AuthenticatedUser) {}
}
