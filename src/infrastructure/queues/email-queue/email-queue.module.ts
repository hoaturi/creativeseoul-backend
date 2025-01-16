import { Module } from '@nestjs/common';
import { EmailProcessor } from './processor/email.processor';
import { BullModule } from '@nestjs/bullmq';
import { EmailService } from '../../services/email/email.service';
import { CronQueueModule } from '../cron-queue/cron-queue.module';
import { QueueType } from '../queue-type.enum';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QueueType.EMAIL,
    }),
    CronQueueModule,
  ],
  providers: [EmailProcessor, EmailService],
})
export class EmailQueueModule {}
