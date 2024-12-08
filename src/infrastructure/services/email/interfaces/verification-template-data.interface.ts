import { TemplateData } from './template-data.interface';

export interface VerificationTemplateData extends TemplateData {
  fullName: string;
  verificationLink: string;
}
