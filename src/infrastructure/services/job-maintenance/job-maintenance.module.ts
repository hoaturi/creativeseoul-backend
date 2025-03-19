import { Module } from '@nestjs/common';
import { JobMaintenanceService } from './job-maintenance.service';
import * as process from 'node:process';
import { RedisModule } from '@nestjs-modules/ioredis';

@Module({
  imports: [
    RedisModule.forRoot({
      type: 'single',
      url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    }),
  ],
  providers: [JobMaintenanceService],
  exports: [JobMaintenanceService],
})
export class JobMaintenanceModule {}
