import { BullRootModuleOptions } from '@nestjs/bullmq';

export const bullMqConfig: BullRootModuleOptions = {
  connection: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
  },
};
