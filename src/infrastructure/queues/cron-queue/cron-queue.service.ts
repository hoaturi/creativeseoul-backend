import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { JobMaintenanceCronType } from './processors/job-maintenance/job-maintenance-cron-type.enum';
import { QueueType } from '../queue-type.enum';

@Injectable()
export class CronQueueService implements OnModuleInit {
  public constructor(
    @InjectQueue(QueueType.JOB_MAINTENANCE) private readonly cronQueue: Queue,
  ) {}

  public async onModuleInit(): Promise<void> {
    await this.scheduleSyncJobApplicationClicks();
    await this.scheduleExpireFeaturedJobs();
  }

  private async scheduleSyncJobApplicationClicks(): Promise<void> {
    await this.cronQueue.upsertJobScheduler(
      JobMaintenanceCronType.SYNC_JOB_APPLICATION_CLICKS,
      {
        every: 60 * 5 * 1000, // 5 minutes
      },
      {
        opts: {
          removeOnComplete: true,
          removeOnFail: true,
        },
      },
    );
  }

  private async scheduleExpireFeaturedJobs(): Promise<void> {
    await this.cronQueue.upsertJobScheduler(
      JobMaintenanceCronType.EXPIRE_FEATURED_JOBS,
      {
        every: 60 * 30 * 1000, // 30 minutes
      },
      {
        opts: {
          removeOnComplete: true,
          removeOnFail: true,
        },
      },
    );
  }
}
