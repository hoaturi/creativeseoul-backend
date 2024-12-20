import { Redis } from 'ioredis';
import * as dotenv from 'dotenv';
import { RedisStore } from 'connect-redis';

dotenv.config();

export const sessionConfig = () => {
  const redisClient = new Redis({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
  });

  const redisStore = new RedisStore({
    client: redisClient,
    prefix: 'session:',
    ttl: 60 * 60 * 24 * 7,
  });

  return {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: redisStore,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7 * 1000,
    },
  };
};
