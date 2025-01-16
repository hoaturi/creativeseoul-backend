import { Module } from '@nestjs/common';
import { JobMetricService } from './job-metric.service';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
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
  providers: [JobMetricService],
  exports: [JobMetricService],
})
export class JobMetricModule {}
