import { Command } from '@nestjs/cqrs';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';

export class TrackJobApplicationClickCommand extends Command<
  Result<void, ResultError>
> {
  public constructor(
    public readonly jobId: string,
    public readonly ipAddress: string,
  ) {
    super();
  }
}
