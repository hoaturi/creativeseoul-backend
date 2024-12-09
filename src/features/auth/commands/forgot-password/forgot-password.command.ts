import { Command } from '@nestjs/cqrs';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';
import { ForgotPasswordRequestDto } from '../../dtos';

export class ForgotPasswordCommand extends Command<Result<void, ResultError>> {
  public constructor(public readonly dto: ForgotPasswordRequestDto) {
    super();
  }
}
