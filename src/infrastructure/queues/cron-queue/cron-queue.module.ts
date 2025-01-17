import { Module } from '@nestjs/common';
import { CronQueueService } from './cron-queue.service';
import { JobMetricModule } from '../../services/job-metric/job-metric.module';
import { BullModule } from '@nestjs/bullmq';
import { QueueType } from '../queue-type.enum';
import { JobMaintenanceCronJobProcessor } from './processors/job-maintenance/job-maintenance-cron.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QueueType.JOB_MAINTENANCE,
    }),
    JobMetricModule,
  ],
  providers: [CronQueueService, JobMaintenanceCronJobProcessor],
})
export class CronQueueModule {}
