import { Module } from '@nestjs/common';
import { JobMaintenanceService } from './job-maintenance.service';
import * as process from 'node:process';
import { RedisModule } from '@nestjs-modules/ioredis';

@Module({
  imports: [
    RedisModule.forRoot({
      type: 'single',
      options: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT!),
        username: process.env.REDIS_USER,
        password: process.env.REDIS_PASSWORD,
      },
    }),
  ],
  providers: [JobMaintenanceService],
  exports: [JobMaintenanceService],
})
export class JobMaintenanceModule {}
