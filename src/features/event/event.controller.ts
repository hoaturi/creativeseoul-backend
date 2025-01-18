import {
  Body,
  Controller,
  HttpException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../../infrastructure/security/decorators/roles.decorator';
import { UserRole } from '../../domain/user/user-role.enum';
import { AuthGuard } from '../../infrastructure/security/guards/auth.guard';
import { RolesGuard } from '../../infrastructure/security/guards/roles.guard';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthError } from '../auth/auth.error';
import { CommonError } from '../common/common.error';
import { CreateEventRequestDto } from './dtos/create-event-request.dto';
import { CreateEventCommand } from './commands/create-event.command';
import { CommandBus } from '@nestjs/cqrs';
import { EventError } from './event.error';

@Controller('events')
export class EventController {
  public constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOkResponse()
  @ApiUnauthorizedResponse({
    example: AuthError.Unauthenticated,
  })
  @ApiForbiddenResponse({
    example: AuthError.Unauthorized,
  })
  @ApiBadRequestResponse({
    examples: {
      ValidationFailed: {
        summary: 'Validation failed',
        value: CommonError.ValidationFailed,
      },
      RequiredUrlMissing: {
        summary: 'Required URL missing',
        value: EventError.RequiredUrlMissing,
      },
    },
  })
  public async createEvent(@Body() dto: CreateEventRequestDto): Promise<void> {
    const command = new CreateEventCommand(dto);

    const result = await this.commandBus.execute(command);

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }
  }
}
