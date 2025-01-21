import { Module } from '@nestjs/common';
import { JobController } from './job.controller';
import { CreateFeaturedJobHandler } from './commands/create-featured-job/create-featured-job.handler';
import { CreateRegularJobHandler } from './commands/create-regular-job/create-regular-job.handler';
import { GetJobListHandler } from './queries/get-job-list/get-job-list.handler';
import { GetJobHandler } from './queries/get-job/get-job.handler';
import { UpdateJobHandler } from './commands/update-job/update-job.handler';
import { TrackJobApplicationClickHandler } from './commands/track-job-application-click/track-job-application-click.handler';
import { JobMaintenanceModule } from '../../infrastructure/services/job-maintenance/job-maintenance.module';
import { GetMyJobListHandler } from './queries/get-my-job-list/get-my-job-list.handler';
import { DeleteJobHandler } from './commands/delete-job/delete-job.handler';
import { UnpublishJobHandler } from './commands/unpublish-job/unpublish-job.handler';
import { PublishJobHandler } from './commands/publish-job/publish-job.handler';
import { RenewFeaturedJobHandler } from './commands/renew-featured-job/renew-featured-job.handler';
import { GetFeaturedJobListHandler } from './queries/get-featured-job-list/get-featured-job-list.handler';
import { GetRegularJobListHandler } from './queries/get-regular-job-list/get-regular-job-list.handler';

@Module({
  imports: [JobMaintenanceModule],
  providers: [
    CreateFeaturedJobHandler,
    CreateRegularJobHandler,
    GetJobListHandler,
    GetJobHandler,
    UpdateJobHandler,
    TrackJobApplicationClickHandler,
    GetMyJobListHandler,
    DeleteJobHandler,
    UnpublishJobHandler,
    PublishJobHandler,
    RenewFeaturedJobHandler,
    GetFeaturedJobListHandler,
    GetRegularJobListHandler,
  ],
  controllers: [JobController],
})
export class JobModule {}
