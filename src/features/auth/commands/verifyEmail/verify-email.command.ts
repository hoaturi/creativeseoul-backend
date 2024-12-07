import { Command } from '@nestjs/cqrs';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';
import { VerifyEmailRequestDto } from '../../dtos/verify-email-request.dto';

export class VerifyEmailCommand extends Command<Result<void, ResultError>> {
  constructor(public readonly dto: VerifyEmailRequestDto) {
    super();
  }
}
