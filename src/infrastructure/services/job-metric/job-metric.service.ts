import { Inject, Injectable, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { EntityManager, raw } from '@mikro-orm/postgresql';
import { Job } from '../../../domain/job/job.entity';

@Injectable()
export class JobMetricService {
  private readonly logger = new Logger(JobMetricService.name);
  private readonly CLICK_COOLDOWN = 60 * 60 * 6 * 1000;

  public constructor(
    private readonly em: EntityManager,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  public async trackJobClick(jobId: string, ipAddress: string): Promise<void> {
    const ipKey = `job:${jobId}:ip:${ipAddress}`;
    const clickCountKey = `job:${jobId}:click-count`;

    const lastClick = await this.cacheManager.get(ipKey);

    if (lastClick) {
      return;
    }

    await this.cacheManager.set(ipKey, this.CLICK_COOLDOWN);

    const clickCount =
      (await this.cacheManager.get<number>(clickCountKey)) || 0;

    await this.cacheManager.set(clickCountKey, clickCount + 1);
  }

  public async syncJobApplicationClicks(): Promise<void> {
    try {
      const keys = await this.cacheManager.store.keys('job:*:click-count');

      const updates = await Promise.all(
        keys.map(async (key) => {
          const jobId = key.split(':')[1];
          const clickCount = await this.cacheManager.get<number>(key);
          return { jobId, clickCount, key };
        }),
      );

      if (updates.length === 0) {
        return;
      }

      const cases = updates
        .map(
          (u) =>
            `WHEN id = '${u.jobId}' THEN application_click_count + ${u.clickCount}`,
        )
        .join(' ');

      await this.em
        .createQueryBuilder(Job)
        .update({
          applicationClickCount: raw(
            `CASE ${cases} ELSE application_click_count END`,
          ),
        })
        .where({ id: { $in: updates.map((u) => u.jobId) } })
        .execute('get');

      await Promise.all(updates.map((u) => this.cacheManager.del(u.key)));
    } catch (error) {
      this.logger.error(
        { error },
        'job-metric-service.sync-job-clicks-failed: Failed to sync job clicks',
      );
    }
  }
}
