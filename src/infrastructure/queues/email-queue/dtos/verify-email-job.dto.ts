import { User } from '../../../../domain/user/user.entity';

export class VerifyEmailJobDto {
  public readonly userId: string;
  public readonly email: string;
  public readonly verificationToken: string;

  public constructor(user: User, verificationToken: string) {
    this.userId = user.id;
    this.email = user.email;
    this.verificationToken = verificationToken;
  }
}
