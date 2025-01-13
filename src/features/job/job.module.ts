import { Module } from '@nestjs/common';
import { JobController } from './job.controller';
import { CreateFeaturedJobHandler } from './commands/create-featured-job/create-featured-job.handler';
import { CreateRegularJobHandler } from './commands/create-regular-job/create-regular-job.handler';
import { GetJobListHandler } from './queries/get-job-list/get-job-list.handler';
import { GetJobHandler } from './queries/get-job/get-job.handler';
import { UpdateJobHandler } from './commands/update-job/update-job.handler';

@Module({
  providers: [
    CreateFeaturedJobHandler,
    CreateRegularJobHandler,
    GetJobListHandler,
    GetJobHandler,
    UpdateJobHandler,
  ],
  controllers: [JobController],
})
export class JobModule {}
