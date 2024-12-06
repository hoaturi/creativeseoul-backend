import { JobsOptions } from 'bullmq';

export const authEmailOption: JobsOptions = {
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 5000,
  },
  removeOnComplete: true,
  removeOnFail: true,
};
