import { Processor } from '@nestjs/bullmq';
import { QueueType } from '../../../queue-type.enum';
import { BaseProcessor } from '../../../base.processor';
import { JobMaintenanceService } from '../../../../services/job-maintenance/job-maintenance.service';
import { JobMaintenanceCronType } from './job-maintenance-cron-type.enum';
import { Job } from 'bullmq';

@Processor(QueueType.JOB_MAINTENANCE)
export class JobMaintenanceCronJobProcessor extends BaseProcessor {
  public constructor(
    private readonly jobMaintenanceService: JobMaintenanceService,
  ) {
    super(JobMaintenanceCronJobProcessor.name);
  }

  public async process(job: Job): Promise<void> {
    switch (job.name) {
      case JobMaintenanceCronType.SYNC_JOB_APPLICATION_CLICKS:
        await this.jobMaintenanceService.syncJobApplicationClicks();
        break;
      case JobMaintenanceCronType.EXPIRE_FEATURED_JOBS:
        await this.jobMaintenanceService.expireFeaturedJobs();
        break;
    }
  }
}
