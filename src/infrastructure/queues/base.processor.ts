import { Logger, OnModuleInit } from '@nestjs/common';
import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

export abstract class BaseProcessor extends WorkerHost implements OnModuleInit {
  protected readonly logger: Logger;

  protected constructor(context: string) {
    super();
    this.logger = new Logger(context);
  }

  public async onModuleInit(): Promise<void> {
    this.worker.on('failed', (job: Job | undefined, err: Error) => {
      if (job) {
        this.logger.error(`Job ${job.id} of type ${job.name} failed. ${err}`);
      } else {
        this.logger.error(`Job failed. ${err}`);
      }
    });
  }
}
