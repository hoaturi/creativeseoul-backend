import { Module } from '@nestjs/common';
import { CronQueueService } from './cron-queue.service';
import { JobMaintenanceModule } from '../../services/job-maintenance/job-maintenance.module';
import { BullModule } from '@nestjs/bullmq';
import { QueueType } from '../queue-type.enum';
import { JobMaintenanceCronJobProcessor } from './processors/job-maintenance/job-maintenance-cron.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QueueType.JOB_MAINTENANCE,
    }),
    JobMaintenanceModule,
  ],
  providers: [CronQueueService, JobMaintenanceCronJobProcessor],
})
export class CronQueueModule {}
