import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TrackJobApplicationClickCommand } from './track-job-application-click.command';
import { Result } from 'src/common/result/result';
import { ResultError } from 'src/common/result/result-error';
import { JobMetricService } from '../../../../infrastructure/services/job-metric/job-metric.service';

@CommandHandler(TrackJobApplicationClickCommand)
export class TrackJobApplicationClickHandler
  implements ICommandHandler<TrackJobApplicationClickCommand>
{
  public constructor(private readonly jobMetricService: JobMetricService) {}

  public async execute(
    command: TrackJobApplicationClickCommand,
  ): Promise<Result<void, ResultError>> {
    const { jobId, ipAddress } = command;

    await this.jobMetricService.trackJobClick(jobId, ipAddress);

    return Result.success();
  }
}
