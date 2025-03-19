import { Injectable, Logger } from '@nestjs/common';
import { EntityManager, raw } from '@mikro-orm/postgresql';
import { Job } from '../../../domain/job/entities/job.entity';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';

@Injectable()
export class JobMaintenanceService {
  private readonly logger = new Logger(JobMaintenanceService.name);
  private readonly CLICK_COOLDOWN = 60 * 60 * 6; // 6 hours in seconds
  private readonly FEATURE_DURATION = 1000 * 60 * 60 * 24 * 30; // 30 days in milliseconds

  private readonly JOB_CLICKS_HASH = 'job:clicks';
  private readonly JOB_IP_PREFIX = 'job:ip:';

  public constructor(
    private readonly em: EntityManager,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  public async trackJobClick(jobId: string, ipAddress: string): Promise<void> {
    const ipKey = `${this.JOB_IP_PREFIX}${jobId}:${ipAddress}`;

    const exists = await this.redis.exists(ipKey);

    if (exists) {
      return;
    }

    await this.redis.set(ipKey, '1', 'EX', this.CLICK_COOLDOWN);

    // Increment click count in hash table
    await this.redis.hincrby(this.JOB_CLICKS_HASH, jobId, 1);
  }

  public async syncJobApplicationClicks(): Promise<void> {
    this.logger.log(
      'job-metric.sync-job-application-clicks.started: Starting to sync job application clicks',
    );

    // Get all job click counts from hash
    const clickData = await this.redis.hgetall(this.JOB_CLICKS_HASH);

    if (Object.keys(clickData).length === 0) {
      this.logger.log(
        'job-metric.sync-job-application-clicks.success: No job application clicks to sync',
      );
      return;
    }

    // Format data for update
    const updates = Object.entries(clickData).map(([jobId, clickCount]) => ({
      jobId,
      clickCount: parseInt(clickCount),
    }));

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

    // Clear the hash after successful sync
    await this.redis.del(this.JOB_CLICKS_HASH);

    this.logger.log(
      `job-metric.sync-job-application-clicks.success: Synced ${updates.length} job application clicks successfully`,
    );
  }

  public async expireFeaturedJobs(): Promise<void> {
    this.logger.log(
      'job-metric.sync-expired-featured-jobs.started: Starting to expire featured jobs',
    );

    const expirationDate = new Date(Date.now() - this.FEATURE_DURATION);

    const result = await this.em.nativeUpdate(
      Job,
      {
        isFeatured: true,
        createdAt: { $lt: expirationDate },
      },
      {
        isFeatured: false,
      },
    );

    this.logger.log(
      `job-metric.sync-expired-featured-jobs.success: Expired ${result} featured jobs successfully`,
    );
  }
}
