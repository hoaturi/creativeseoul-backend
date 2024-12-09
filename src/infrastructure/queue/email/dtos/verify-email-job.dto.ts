import { User } from '../../../../domain/user/user.entity';

export class VerifyEmailJobDto {
  public readonly userId: string;
  public readonly email: string;
  public readonly fullName: string;
  public readonly verificationToken: string;

  constructor(user: User, verificationToken: string) {
    this.userId = user.id;
    this.email = user.email;
    this.fullName = user.userName;
    this.verificationToken = verificationToken;
  }
}
