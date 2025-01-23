import { Command } from '@nestjs/cqrs';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';
import { LoginRequestDto } from '../../dtos';
import { LoginResponseDto } from '../../dtos/login-response.dto';

export class LoginCommand extends Command<
  Result<LoginResponseDto, ResultError>
> {
  public constructor(public readonly dto: LoginRequestDto) {
    super();
  }
}
