import { Module } from '@nestjs/common';
import { JobController } from './job.controller';
import { CreateFeaturedJobHandler } from './commands/create-featured-job/create-featured-job.handler';
import { CreateRegularJobHandler } from './commands/create-regular-job/create-regular-job.handler';
import { GetJobListHandler } from './queries/get-job-list/get-job-list.handler';

@Module({
  providers: [
    CreateFeaturedJobHandler,
    CreateRegularJobHandler,
    GetJobListHandler,
  ],
  controllers: [JobController],
})
export class JobModule {}
