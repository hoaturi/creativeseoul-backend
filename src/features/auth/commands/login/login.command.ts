import { Command } from '@nestjs/cqrs';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';
import { LoginResponseDto } from '../../dtos/login-response.dto';
import { LoginRequestDto } from '../../dtos/login-request.dto';

export class LoginCommand extends Command<
  Result<LoginResponseDto, ResultError>
> {
  constructor(public readonly dto: LoginRequestDto) {
    super();
  }
}
