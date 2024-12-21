import { registerAs } from '@nestjs/config';

export const applicationConfig = registerAs('app', () => ({
  client: {
    baseUrl: process.env.CLIENT_BASE_URL,
  },
  aws: {
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    bucketName: process.env.AWS_BUCKET_NAME,
  },
  email: {
    from: process.env.EMAIL_FROM,
  },
}));
