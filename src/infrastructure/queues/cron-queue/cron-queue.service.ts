import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { CronJobType } from './cron-queue-type.enum';
import { QueueType } from '../queue-type.enum';

@Injectable()
export class CronQueueService implements OnModuleInit {
  public constructor(
    @InjectQueue(QueueType.CRON) private readonly cronQueue: Queue,
  ) {}

  public async onModuleInit(): Promise<void> {
    await this.scheduleSyncJobApplicationClicks();
  }

  private async scheduleSyncJobApplicationClicks(): Promise<void> {
    await this.cronQueue.upsertJobScheduler(
      CronJobType.SYNC_JOB_APPLICATION_CLICKS,
      {
        every: 60 * 5 * 1000,
      },
    );
  }
}
