import { Command } from '@nestjs/cqrs';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';
import { UpsertProfessionalRequestDto } from '../../dtos/requests/upsert-professional-request.dto';

export class UpsertProfessionalCommand extends Command<
  Result<void, ResultError>
> {
  public constructor(
    public readonly profileId: string,
    public readonly dto: UpsertProfessionalRequestDto,
  ) {
    super();
  }
}
