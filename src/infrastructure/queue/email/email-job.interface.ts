export interface VerifyEmailJob {
  userId: string;
  email: string;
  fullName: string;
  verificationToken: string;
}
