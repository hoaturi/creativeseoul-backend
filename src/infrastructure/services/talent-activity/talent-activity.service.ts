// infrastructure/user-activity.service.ts
import { Inject, Injectable, Logger } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Talent } from '../../../domain/talent/talent.entity';

@Injectable()
export class TalentActivityService {
  private readonly logger = new Logger(TalentActivityService.name);
  private readonly UPDATE_INTERVAL = 4 * 60 * 60 * 1000;

  public constructor(
    private readonly em: EntityManager,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  public async updateLastActive(talentId: string): Promise<void> {
    try {
      const cacheKey = `last_active:${talentId}`;
      const hasRecentUpdate = await this.cacheManager.get<boolean>(cacheKey);

      if (hasRecentUpdate) {
        return;
      }

      await this.cacheManager.set(cacheKey, true, this.UPDATE_INTERVAL);

      await this.em.nativeUpdate(Talent, talentId, {
        lastActiveAt: new Date(),
      });
      await this.cacheManager.del(cacheKey);
    } catch (error) {
      this.logger.error(
        { talentId, error },
        'talent-activity-service.update-last-active-failed: Failed to update last active',
      );
    }
  }
}
