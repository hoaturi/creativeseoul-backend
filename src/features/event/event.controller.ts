import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
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
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthError } from '../auth/auth.error';
import { CommonError } from '../common/common.error';
import { CreateEventRequestDto } from './dtos/create-event-request.dto';
import { CreateEventCommand } from './commands/create-event.command';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { EventError } from './event.error';
import { GetEventResponseDto } from './dtos/get-event-response.dto';
import { GetEventQuery } from './queries/get-event/get-event.query';
import { GetEventListResponseDto } from './dtos/get-event-list-response.dto';
import { GetEventListQuery } from './queries/get-event-list/get-event-list.query';

@Controller('events')
export class EventController {
  public constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

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

  @Get()
  @ApiOkResponse({
    type: GetEventListResponseDto,
  })
  public async getEventList(): Promise<GetEventListResponseDto> {
    const query = new GetEventListQuery();

    const result = await this.queryBus.execute(query);

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }

    return result.value;
  }

  @Get(':slug')
  @ApiOkResponse({
    type: GetEventResponseDto,
  })
  @ApiNotFoundResponse({
    example: EventError.EventNotFound,
  })
  public async getEvent(
    @Param('slug') slug: string,
  ): Promise<GetEventResponseDto> {
    const query = new GetEventQuery(slug);

    const result = await this.queryBus.execute(query);

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }

    return result.value;
  }
}
