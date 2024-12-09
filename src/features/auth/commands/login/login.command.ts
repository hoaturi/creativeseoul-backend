import { Command } from '@nestjs/cqrs';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';
import { LoginRequestDto } from '../../dtos';
import { LoginCommandResult } from './login-command.result';

export class LoginCommand extends Command<
  Result<LoginCommandResult, ResultError>
> {
  public constructor(public readonly dto: LoginRequestDto) {
    super();
  }
}
