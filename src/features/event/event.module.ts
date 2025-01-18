import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { CreateEventHandler } from './commands/create-event.handler';

@Module({
  providers: [CreateEventHandler],
  controllers: [EventController],
})
export class EventModule {}
