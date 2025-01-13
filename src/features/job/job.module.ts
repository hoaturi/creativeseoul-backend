import { Module } from '@nestjs/common';
import { JobController } from './job.controller';
import { CreateFeaturedJobHandler } from './commands/create-featured-job/create-featured-job.handler';
import { CreateRegularJobHandler } from './commands/create-regular-job/create-regular-job.handler';

@Module({
  providers: [CreateFeaturedJobHandler, CreateRegularJobHandler],
  controllers: [JobController],
})
export class JobModule {}
