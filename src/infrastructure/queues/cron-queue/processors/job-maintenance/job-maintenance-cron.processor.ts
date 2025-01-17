import { InjectQueue, Processor } from '@nestjs/bullmq';
import { QueueType } from '../../../queue-type.enum';
import { BaseProcessor } from '../../../base.processor';
import { JobMetricService } from '../../../../services/job-metric/job-metric.service';
import { JobMaintenanceCronType } from './job-maintenance-cron-type.enum';
import { Job, Queue } from 'bullmq';

@Processor(QueueType.JOB_MAINTENANCE)
export class JobMaintenanceCronJobProcessor extends BaseProcessor {
  public constructor(
    private readonly jobMetricService: JobMetricService,
    @InjectQueue(QueueType.JOB_MAINTENANCE) private readonly queue: Queue,
  ) {
    super(JobMaintenanceCronJobProcessor.name);
  }

  public async process(job: Job): Promise<void> {
    switch (job.name) {
      case JobMaintenanceCronType.SYNC_JOB_APPLICATION_CLICKS:
        await this.jobMetricService.syncJobApplicationClicks();
        break;
      case JobMaintenanceCronType.EXPIRE_FEATURED_JOBS:
        await this.jobMetricService.expireFeaturedJobs();
        break;
    }
  }
}
