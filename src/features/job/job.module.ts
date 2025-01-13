import { Module } from '@nestjs/common';
import { JobController } from './job.controller';
import { CreateFeaturedJobHandler } from './commands/create-featured-job/create-featured-job.handler';

@Module({
  providers: [CreateFeaturedJobHandler],
  controllers: [JobController],
})
export class JobModule {}
