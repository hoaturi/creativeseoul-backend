import { Command } from '@nestjs/cqrs';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';
import { LoginRequestDto } from '../../dtos/login-request.dto';
import { LoginCommandResult } from './login-command.result';

export class LoginCommand extends Command<
  Result<LoginCommandResult, ResultError>
> {
  constructor(public readonly dto: LoginRequestDto) {
    super();
  }
}
