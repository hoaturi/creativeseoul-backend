import { registerAs } from '@nestjs/config';
import { ENV_KEYS } from './env.validation';

export const applicationConfig = registerAs('app', () => ({
  client: {
    baseUrl: process.env[ENV_KEYS.CLIENT.BASE_URL],
  },
  jwt: {
    accessSecret: process.env[ENV_KEYS.JWT.ACCESS_SECRET],
    refreshSecret: process.env[ENV_KEYS.JWT.REFRESH_SECRET],
    accessExpirationInMs: parseInt(
      process.env[ENV_KEYS.JWT.ACCESS_EXPIRATION_IN_MS],
    ),
    refreshExpirationInMs: parseInt(
      process.env[ENV_KEYS.JWT.REFRESH_EXPIRATION_IN_MS],
    ),
  },
  aws: {
    region: process.env[ENV_KEYS.AWS.REGION],
    accessKeyId: process.env[ENV_KEYS.AWS.ACCESS_KEY_ID],
    secretAccessKey: process.env[ENV_KEYS.AWS.SECRET_ACCESS_KEY],
  },
  email: {
    from: process.env[ENV_KEYS.EMAIL.FROM],
  },
}));
