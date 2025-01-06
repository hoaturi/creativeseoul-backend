import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '../../infrastructure/security/guards/auth.guard';
import { AuthError } from '../auth/auth.error';
import { CommonError } from '../common/common.error';
import { CurrentUser } from '../../infrastructure/security/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../infrastructure/security/authenticated-user.interface';
import { Roles } from '../../infrastructure/security/decorators/roles.decorator';
import { RolesGuard } from '../../infrastructure/security/guards/roles.guard';
import { UpsertTalentCommand } from './commands/upsert-talent/upsert-talent.command';
import { UserRole } from '../../domain/user/user-role.enum';
import { GetTalentQuery } from './queries/get-talent/get-talent.query';
import { TalentError } from './talent.error';
import { GetTalentListResponseDto } from './dtos/responses/get-talent-list-response.dto';
import { GetTalentListQuery } from './queries/get-talent-list/get-talent-list.query';
import { GetTalentListQueryDto } from './dtos/requests/get-talent-list-query.dto';
import { UpsertTalentRequestDto } from './dtos/requests/upsert-talent-request.dto';
import { GetTalentResponseDto } from './dtos/responses/get-talent-response.dto';

@Controller('talent')
export class TalentController {
  public constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @ApiOkResponse({ type: GetTalentListResponseDto })
  @ApiUnauthorizedResponse({
    example: AuthError.Unauthenticated,
  })
  @ApiForbiddenResponse({
    example: AuthError.Unauthorized,
  })
  @ApiBadRequestResponse({
    example: CommonError.ValidationFailed,
  })
  public async getTalentList(
    @Query() queryDto: GetTalentListQueryDto,
  ): Promise<GetTalentListResponseDto> {
    const command = new GetTalentListQuery(queryDto);

    const result = await this.queryBus.execute(command);

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }

    return result.value;
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiOkResponse({ type: GetTalentResponseDto })
  @ApiNotFoundResponse({
    example: TalentError.NotFound,
  })
  public async getTalent(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ): Promise<GetTalentResponseDto> {
    const command = new GetTalentQuery(user, id);

    const result = await this.queryBus.execute(command);

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }

    return result.value;
  }

  @Put('me')
  @Roles(UserRole.Talent)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOkResponse()
  @ApiUnauthorizedResponse({
    example: AuthError.Unauthenticated,
  })
  @ApiForbiddenResponse({
    example: AuthError.Unauthorized,
  })
  @ApiBadRequestResponse({
    example: CommonError.ValidationFailed,
  })
  public async upsertTalent(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpsertTalentRequestDto,
  ): Promise<void> {
    const command = new UpsertTalentCommand(user, dto);

    const result = await this.commandBus.execute(command);

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }

    return result.value;
  }
}
