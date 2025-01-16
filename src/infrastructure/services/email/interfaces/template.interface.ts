import { EmailJobType } from '../../../queues/email-queue/email-queue.type.enum';
import { TemplateData } from './template-data.interface';

export interface Template {
  templateType: EmailJobType;
  templateData: TemplateData;
}
