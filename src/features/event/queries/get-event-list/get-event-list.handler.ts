import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetEventListQuery } from './get-event-list.query';
import { Result } from 'src/common/result/result';
import { ResultError } from 'src/common/result/result-error';
import { GetEventListResponseDto } from '../../dtos/get-event-list-response.dto';
import { EntityManager } from '@mikro-orm/postgresql';
import { Event } from '../../../../domain/event/event.entity';

@QueryHandler(GetEventListQuery)
export class GetEventListHandler implements IQueryHandler<GetEventListQuery> {
  public constructor(private readonly em: EntityManager) {}

  public async execute(
    query: GetEventListQuery,
  ): Promise<Result<GetEventListResponseDto, ResultError>> {
    console.log(query.dto.limit);
    const events = await this.em.find(
      Event,
      {
        endDate: {
          $gte: new Date(),
        },
      },
      {
        fields: [
          'slug',
          'eventType.label',
          'title',
          'startDate',
          'endDate',
          'coverImageUrl',
        ],
        orderBy: { startDate: 'ASC' },
        limit: query.dto.limit,
      },
    );

    const response = new GetEventListResponseDto(
      events.map((event) => ({
        slug: event.slug,
        eventType: event.eventType.label,
        title: event.title,
        startDate: event.startDate,
        endDate: event.endDate,
        coverImageUrl: event.coverImageUrl,
      })),
    );

    return Result.success(response);
  }
}
