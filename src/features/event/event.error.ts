import { ResultError } from '../../common/result/result-error';
import { EventErrorCode } from './event-error-code.enum';
import { HttpStatus } from '@nestjs/common';

export class EventError extends ResultError {
  public static readonly RequiredUrlMissing = new EventError(
    EventErrorCode.RequiredUrlMissing,
    HttpStatus.BAD_REQUEST,
    'Either registerUrl or websiteUrl is required',
  );

  public static readonly EventNotFound = new EventError(
    EventErrorCode.EventNotFound,
    HttpStatus.NOT_FOUND,
    'Event not found',
  );
}
