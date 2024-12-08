import { EmailJobType } from '../../../queue/email/email-job.type.enum';
import { TemplateData } from './template-data.interface';

export interface Template {
  templateType: EmailJobType;
  templateData: TemplateData;
}
