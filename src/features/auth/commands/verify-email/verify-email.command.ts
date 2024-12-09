import { Command } from '@nestjs/cqrs';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';
import { VerifyEmailRequestDto } from '../../dtos';

export class VerifyEmailCommand extends Command<Result<void, ResultError>> {
  public constructor(public readonly dto: VerifyEmailRequestDto) {
    super();
  }
}
