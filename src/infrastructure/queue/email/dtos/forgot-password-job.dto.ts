export class ForgotPasswordJobDto {
  public readonly userId: string;
  public readonly email: string;
  public readonly token: string;

  constructor(userId: string, email: string, token: string) {
    this.userId = userId;
    this.email = email;
    this.token = token;
  }
}
