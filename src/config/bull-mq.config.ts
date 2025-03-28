import { BullRootModuleOptions } from '@nestjs/bullmq';
import * as dotenv from 'dotenv';

dotenv.config();

export const bullMqConfig: BullRootModuleOptions = {
  connection: {
    host: process.env.REDIS_HOST!,
    port: parseInt(process.env.REDIS_PORT!),
    username: process.env.REDIS_USER,
    password: process.env.REDIS_PASSWORD,
  },
};
