import { registerAs } from '@nestjs/config';

export const applicationConfig = registerAs('app', () => ({
  client: {
    baseUrl: process.env.CLIENT_BASE_URL,
  },
  aws: {
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  cloudflare: {
    r2: {
      token: process.env.CLOUDFLARE_R2_TOKEN,
      accessKey: process.env.CLOUDFLARE_R2_ACCESS_KEY,
      secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
      endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
      bucket: process.env.CLOUDFLARE_R2_BUCKET,
      region: process.env.CLOUDFLARE_R2_REGION,
    },
  },
  email: {
    from: process.env.EMAIL_FROM,
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    singleJobPriceId: process.env.STRIPE_SINGLE_JOB_CREDIT_PRICE_ID,
    threeJobsPriceId: process.env.STRIPE_THREE_JOB_CREDITS_PRICE_ID,
    sponsorshipPriceId: process.env.STRIPE_SPONSORSHIP_PRICE_ID,
  },
}));
