import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { CreateEventHandler } from './commands/create-event/create-event.handler';
import { GetEventHandler } from './queries/get-event/get-event.handler';
import { GetEventListHandler } from './queries/get-event-list/get-event-list.handler';

@Module({
  providers: [CreateEventHandler, GetEventHandler, GetEventListHandler],
  controllers: [EventController],
})
export class EventModule {}
