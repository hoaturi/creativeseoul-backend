import { Module } from '@nestjs/common';
import { JobController } from './job.controller';
import { CreateFeaturedJobHandler } from './commands/create-featured-job/create-featured-job.handler';
import { CreateRegularJobHandler } from './commands/create-regular-job/create-regular-job.handler';
import { GetJobListHandler } from './queries/get-job-list/get-job-list.handler';
import { GetJobHandler } from './queries/get-job/get-job.handler';
import { UpdateJobHandler } from './commands/update-job/update-job.handler';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { TrackJobApplicationClickHandler } from './commands/track-job-application-click/track-job-application-click.handler';
import { redisStore } from 'cache-manager-ioredis-yet';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: async () => {
        const store = await redisStore({
          host: process.env.REDIS_HOST,
          port: process.env.REDIS_PORT,
        });

        return {
          store: store as unknown as CacheStore,
        };
      },
    }),
  ],
  providers: [
    CreateFeaturedJobHandler,
    CreateRegularJobHandler,
    GetJobListHandler,
    GetJobHandler,
    UpdateJobHandler,
    TrackJobApplicationClickHandler,
  ],
  controllers: [JobController],
})
export class JobModule {}
