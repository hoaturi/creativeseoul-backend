import { Command } from '@nestjs/cqrs';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';
import { LoginRequestDto } from '../../dtos';
import { SessionResponseDto } from '../../dtos/session-response.dto';

export class LoginCommand extends Command<
  Result<SessionResponseDto, ResultError>
> {
  public constructor(public readonly dto: LoginRequestDto) {
    super();
  }
}
