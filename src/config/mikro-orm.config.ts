import { defineConfig } from '@mikro-orm/postgresql';
import { Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { SeedManager } from '@mikro-orm/seeder';

dotenv.config();

const logger = new Logger('MikroORM');

export default defineConfig({
  clientUrl: process.env.DATABASE_URL,
  logger: logger.log.bind(logger),
  debug: true,
  entities: ['dist/domain/**/*.entity.js'],
  entitiesTs: ['src/domain/**/*.entity.ts'],
  seeder: {
    path: 'dist/database/seeds',
    pathTs: 'src/database/seeds',
  },
  extensions: [SeedManager],
  migrations: {
    path: 'dist/database/migrations',
    pathTs: 'src/database/migrations',
  },
  forceUndefined: true,
});
