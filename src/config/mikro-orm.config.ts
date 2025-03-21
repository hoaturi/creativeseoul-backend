import { defineConfig } from '@mikro-orm/postgresql';
import { Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { SeedManager } from '@mikro-orm/seeder';

dotenv.config();

const logger = new Logger('MikroORM');

export default defineConfig({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT!),
  dbName: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ...(process.env.NODE_ENV === 'production' && {
    driverOptions: {
      connection: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
    },
  }),
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
