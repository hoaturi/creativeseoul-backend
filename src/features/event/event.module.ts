import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { CreateEventHandler } from './commands/create-event.handler';
import { GetEventHandler } from './queries/get-event/get-event.handler';

@Module({
  providers: [CreateEventHandler, GetEventHandler],
  controllers: [EventController],
})
export class EventModule {}
