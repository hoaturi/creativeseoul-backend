import { Redis } from 'ioredis';
import * as dotenv from 'dotenv';
import { RedisStore } from 'connect-redis';
import { SessionOptions } from 'express-session';

dotenv.config();

const TTL_DAYS = 14;

export const sessionConfig = (): SessionOptions => {
  const redisClient = new Redis({
    host: process.env.REDIS_HOST!,
    port: parseInt(process.env.REDIS_PORT!),
  });

  const redisStore = new RedisStore({
    client: redisClient,
    prefix: 'session:',
    ttl: 60 * 60 * 24 * TTL_DAYS,
  });

  return {
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    store: redisStore,
    rolling: true,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * TTL_DAYS,
    },
  };
};
