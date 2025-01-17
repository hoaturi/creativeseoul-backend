import { Inject, Injectable, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { EntityManager, raw } from '@mikro-orm/postgresql';
import { Job } from '../../../domain/job/job.entity';

@Injectable()
export class JobMetricService {
  private readonly logger = new Logger(JobMetricService.name);
  private readonly CLICK_COOLDOWN = 60 * 60 * 6 * 1000; // 6 hours
  private readonly FEATURE_DURATION = 1000 * 60 * 60 * 24 * 30; // 30 days

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

    await this.cacheManager.set(ipKey, '', this.CLICK_COOLDOWN);

    const clickCount =
      (await this.cacheManager.get<number>(clickCountKey)) || 0;

    await this.cacheManager.set(clickCountKey, clickCount + 1);
  }

  public async syncJobApplicationClicks(): Promise<void> {
    this.logger.log(
      'job-metric.sync-job-application-clicks.started: Starting to sync job application clicks',
    );

    const keys = await this.cacheManager.store.keys('job:*:click-count');

    const updates = await Promise.all(
      keys.map(async (key) => {
        const jobId = key.split(':')[1];
        const clickCount = await this.cacheManager.get<number>(key);
        return { jobId, clickCount, key };
      }),
    );

    if (updates.length === 0) {
      this.logger.log(
        'job-metric.sync-job-application-clicks.success: No job application clicks to sync',
      );
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
      .execute();

    await Promise.all(updates.map((u) => this.cacheManager.del(u.key)));

      this.logger.log(
        {
          jobIds: updates.map((u) => u.jobId),
          count: updates.length,
        },
        `job-metric.sync-job-application-clicks.success: Synced job application clicks successfully`,
      );
    } catch (error) {
      this.logger.error(
        {
          error,
        },
        'job-metric.sync-job-application-clicks.failed: Failed to sync job application clicks',
      );
    }
  }
}
