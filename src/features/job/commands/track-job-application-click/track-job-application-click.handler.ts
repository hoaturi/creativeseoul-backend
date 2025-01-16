import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TrackJobApplicationClickCommand } from './track-job-application-click.command';
import { Result } from 'src/common/result/result';
import { ResultError } from 'src/common/result/result-error';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@CommandHandler(TrackJobApplicationClickCommand)
export class TrackJobApplicationClickHandler
  implements ICommandHandler<TrackJobApplicationClickCommand>
{
  private readonly CLICK_COOLDOWN = 60 * 60 * 6 * 1000;

  public constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}
  public async execute(
    command: TrackJobApplicationClickCommand,
  ): Promise<Result<void, ResultError>> {
    const { jobId, ipAddress } = command;

    const ipKey = `job:${jobId}:ip:${ipAddress}`;
    const clickCountKey = `job:${jobId}:click-count`;

    const lastClick = await this.cacheManager.get(ipKey);

    if (lastClick) {
      return Result.success();
    }

    await this.cacheManager.set(ipKey, this.CLICK_COOLDOWN);

    const clickCount =
      (await this.cacheManager.get<number>(clickCountKey)) || 0;

    await this.cacheManager.set(clickCountKey, clickCount + 1);

    return Result.success();
  }
}
