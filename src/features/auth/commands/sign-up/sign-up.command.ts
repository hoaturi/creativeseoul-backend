import { SignUpRequestDto } from '../../dtos';
import { Command } from '@nestjs/cqrs';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';

export class SignUpCommand extends Command<Result<void, ResultError>> {
  constructor(public readonly user: SignUpRequestDto) {
    super();
  }
}
