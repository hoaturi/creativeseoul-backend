export type BaseTemplateData = Record<string, any>;

export interface VerifyEmailTemplateData extends BaseTemplateData {
  fullName: string;
  verificationLink: string;
}
