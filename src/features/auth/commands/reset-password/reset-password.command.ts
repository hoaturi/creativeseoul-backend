import { Command } from '@nestjs/cqrs';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';
import { ResetPasswordRequestDto } from '../../dtos';

export class ResetPasswordCommand extends Command<Result<void, ResultError>> {
  public readonly token: string;
  public readonly password: string;

  public constructor(dto: ResetPasswordRequestDto) {
    super();
    this.token = dto.token;
    this.password = dto.password;
  }
}
