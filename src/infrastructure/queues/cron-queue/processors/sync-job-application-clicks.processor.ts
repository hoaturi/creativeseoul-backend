import { BaseProcessor } from '../../base.processor';
import { Processor } from '@nestjs/bullmq';
import { CronJobType } from '../cron-queue-type.enum';
import { JobMetricService } from '../../../services/job-metric/job-metric.service';

@Processor(CronJobType.SYNC_JOB_APPLICATION_CLICKS)
export class SyncJobApplicationClicksProcessor extends BaseProcessor {
  public constructor(private readonly jobMetricService: JobMetricService) {
    super(SyncJobApplicationClicksProcessor.name);
  }

  public async process(): Promise<any> {
    await this.jobMetricService.syncJobApplicationClicks();
  }
}
