import { Logger } from '@nestjs/common';
import { defineConfig } from '@mikro-orm/postgresql';
import * as dotenv from 'dotenv';

dotenv.config();

const logger = new Logger('MikroORM');

export const mikroOrmConfig = defineConfig({
  clientUrl: process.env.DATABASE_URL,
  logger: logger.log.bind(logger),
  debug: true,
  entities: ['dist/domain/**/*.entity.js'],
  entitiesTs: ['src/domain/**/*.entity.ts'],
  migrations: {
    path: 'dist/database/migrations',
    pathTs: 'src/database/migrations',
  },
});

export const testMikroOrmConfig = defineConfig({
  clientUrl: process.env.TEST_DATABASE_URL,
  entities: ['src/domain/**/*.entity.ts'],
});
