import { registerAs } from '@nestjs/config';
import { ENV_KEYS } from './env.validation';

export const applicationConfig = registerAs('app', () => ({
  client: {
    baseUrl: process.env[ENV_KEYS.CLIENT.BASE_URL],
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
