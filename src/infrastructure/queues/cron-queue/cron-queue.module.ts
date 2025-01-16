import { Module } from '@nestjs/common';
import { CronQueueService } from './cron-queue.service';
import { JobMetricModule } from '../../services/job-metric/job-metric.module';
import { SyncJobApplicationClicksProcessor } from './processors/sync-job-application-clicks.processor';
import { BullModule } from '@nestjs/bullmq';
import { QueueType } from '../queue-type.enum';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QueueType.CRON,
    }),
    JobMetricModule,
  ],
  providers: [CronQueueService, SyncJobApplicationClicksProcessor],
})
export class CronQueueModule {}
