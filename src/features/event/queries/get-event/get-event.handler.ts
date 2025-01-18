import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetEventQuery } from './get-event.query';
import { Result } from 'src/common/result/result';
import { ResultError } from 'src/common/result/result-error';
import { GetEventResponseDto } from '../../dtos/get-event-response.dto';
import { EntityManager } from '@mikro-orm/postgresql';
import { EventError } from '../../event.error';
import { Event } from '../../../../domain/event/event.entity';

@QueryHandler(GetEventQuery)
export class GetEventHandler implements IQueryHandler<GetEventQuery> {
  public constructor(private readonly em: EntityManager) {}

  public async execute(
    query: GetEventQuery,
  ): Promise<Result<GetEventResponseDto, ResultError>> {
    const { slug } = query;

    const event = await this.em.findOne(
      Event,
      { slug },
      {
        fields: [
          'eventType.label',
          'title',
          'description',
          'startDate',
          'endDate',
          'coverImageUrl',
          'registrationUrl',
          'websiteUrl',
        ],
      },
    );

    if (!event) {
      return Result.failure(EventError.EventNotFound);
    }

    const responseDto = new GetEventResponseDto({
      eventType: event.eventType.label,
      title: event.title,
      description: event.description,
      startDate: event.startDate,
      endDate: event.endDate,
      coverImageUrl: event.coverImageUrl,
      registrationUrl: event.registrationUrl,
      websiteUrl: event.websiteUrl,
    });

    return Result.success(responseDto);
  }
}
