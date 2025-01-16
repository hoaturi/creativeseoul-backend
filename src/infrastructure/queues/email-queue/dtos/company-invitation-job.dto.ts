export class CompanyInvitationJobDto {
  public readonly companyId: string;
  public readonly email: string;
  public readonly token: string;

  public constructor(companyId: string, email: string, token: string) {
    this.companyId = companyId;
    this.email = email;
    this.token = token;
  }
}
