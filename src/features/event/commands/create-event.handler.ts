import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateEventCommand } from './create-event.command';
import { Result } from 'src/common/result/result';
import { ResultError } from 'src/common/result/result-error';
import { EntityManager } from '@mikro-orm/postgresql';
import { Event } from '../../../domain/event/event.entity';
import { EventType } from '../../../domain/event/event-type.entity';
import { EventError } from '../event.error';

@CommandHandler(CreateEventCommand)
export class CreateEventHandler implements ICommandHandler<CreateEventCommand> {
  public constructor(private readonly em: EntityManager) {}

  public async execute(
    command: CreateEventCommand,
  ): Promise<Result<void, ResultError>> {
    const { dto } = command;

    if (!dto.registrationUrl && !dto.websiteUrl) {
      return Result.failure(EventError.RequiredUrlMissing);
    }

    const eventTypeRef = this.em.getReference(EventType, dto.eventTypeId);

    this.em.create(
      Event,
      new Event({
        title: dto.title,
        eventType: eventTypeRef,
        description: dto.description,
        startDate: dto.startDate,
        endDate: dto.endDate,
        coverImageUrl: dto.coverImageUrl,
        registrationUrl: dto.registrationUrl,
        websiteUrl: dto.websiteUrl,
      }),
    );

    await this.em.flush();

    return Result.success();
  }
}
