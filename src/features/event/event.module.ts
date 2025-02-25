import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { CreateEventHandler } from './commands/create-event/create-event.handler';
import { GetEventHandler } from './queries/get-event/get-event.handler';
import { GetEventListHandler } from './queries/get-event-list/get-event-list.handler';
import { StorageModule } from '../../infrastructure/services/storage/storage.module';
import { GenerateEventImageUploadUrlHandler } from './commands/generate-event-image-upload-url/generate-event-image-upload-url.handler';

@Module({
  imports: [StorageModule],
  providers: [
    CreateEventHandler,
    GetEventHandler,
    GetEventListHandler,
    GenerateEventImageUploadUrlHandler,
  ],
  controllers: [EventController],
})
export class EventModule {}
