import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessExpirationInMs: process.env.JWT_ACCESS_EXPIRATION_IN_MS,
    refreshExpirationInMs: process.env.JWT_REFRESH_EXPIRATION_IN_MS,
  },
}));
