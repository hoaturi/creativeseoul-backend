import { Logger, OnModuleInit } from '@nestjs/common';
import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

export abstract class BaseProcessor extends WorkerHost implements OnModuleInit {
  protected readonly logger: Logger;

  protected constructor(context: string) {
    super();
    this.logger = new Logger(context);
  }

  async onModuleInit() {
    this.worker.on('failed', (job: Job, err: Error) => {
      this.logger.error(`Job ${job.id} of type ${job.name} failed. ${err}`);
    });
  }
}
