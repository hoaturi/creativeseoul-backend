import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCurrentUserQuery } from './get-current-user.query';
import { ResultError } from '../../../../common/result/result-error';
import { Result } from '../../../../common/result/result';
import { GetCurrentUserResponseDto } from '../../dtos/get-current-user-response.dto';
import { EntityManager } from '@mikro-orm/postgresql';
import { User } from '../../../../domain/user/user.entity';

@QueryHandler(GetCurrentUserQuery)
export class GetCurrentUserHandler
  implements IQueryHandler<GetCurrentUserQuery>
{
  public constructor(private readonly em: EntityManager) {}

  public async execute(
    query: GetCurrentUserQuery,
  ): Promise<Result<GetCurrentUserResponseDto, ResultError>> {
    const { userId } = query;

    console.log('userId', userId);

    const user = await this.em.findOneOrFail(
      User,
      { id: userId },
      { fields: ['username', 'role'] },
    );

    return Result.success(
      new GetCurrentUserResponseDto(user.username, user.role),
    );
  }
}
